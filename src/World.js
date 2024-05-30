import * as THREE from '../node_modules/three/build/three.module.js';

/** The fundamental set up and animation structures for 3D Visualization */
export default class World {

    constructor(mainObject) {
        this.container_bg = document.getElementById('appbody-bg');
        this.container_fg = document.getElementById('appbody-fg');
        
        // camera and world
        this.scene = new THREE.Scene();

        this.forcedPixelsPerMeter = 100.0;
        this.cameraDepth          = 5.0;
        this.cameraFoV            = 60.0;

        this.camera = new THREE.PerspectiveCamera( this.cameraFoV, window.innerWidth / window.innerHeight, 2.0, 1000 );
        this.camera.position.set( 0.0, 0.0, this.cameraDepth );
        this.camera.layers.enableAll();
        this.scene.add(this.camera);

        this._forcePixelsPerMeter();

        this.spotLight = new THREE.SpotLight( 0xffffff, Math.PI * 10.0 );
        this.spotLight.angle = Math.PI / 5;
        this.spotLight.penumbra = 0.2;
        this.spotLight.position.set( -2, 3, 3 );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 1;
        this.spotLight.shadow.camera.far = 20;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.scene.add( this.spotLight );

        this.dirLight = new THREE.DirectionalLight( 0x55505a, Math.PI * 10.0 );
        this.dirLight.position.set( 0, 3, 0 );
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.near = -10;
        this.dirLight.shadow.camera.far = 10;

        this.dirLight.shadow.camera.right = 3;
        this.dirLight.shadow.camera.left = - 3;
        this.dirLight.shadow.camera.top	= 3;
        this.dirLight.shadow.camera.bottom = - 3;

        this.dirLight.shadow.mapSize.width = 1024;
        this.dirLight.shadow.mapSize.height = 1024;
        this.scene.add( this.dirLight );
        
        // Geometry

        for(let i = 0; i < 10; i++){
            this.helper0 = new THREE.GridHelper( 20, 20 );
            this.helper0.material.opacity = 0.2;
            this.helper0.material.transparent = true;
            this.helper0.position.set((window.innerWidth * 0.5) / this.pixelsPerMeter, i * -5.0, 0);
            this.scene.add( this.helper0 );
        }

        this.renderingMode = 2;

        // renderer
        this.renderer_bg = new THREE.WebGLRenderer( { antialias: true } ); //, alpha: true
        this.renderer_bg.setPixelRatio(1.0);//window.devicePixelRatio > 1.5 ? 1.0 : 1.0);
        this.renderer_bg.shadowMap.enabled = true;
        this.renderer_bg.setAnimationLoop(mainObject.update.bind(mainObject));
        this.renderer_bg.setClearColor( 0x000000, 0 ); // the default

        this.renderer_fg = new THREE.WebGLRenderer( { antialias: true } ); //, alpha: true
        this.renderer_fg.setPixelRatio(1.0);//window.devicePixelRatio > 1.5 ? 1.0 : 1.0);
        this.renderer_fg.shadowMap.enabled = true;
        //this.renderer_fg.setAnimationLoop(mainObject.update.bind(mainObject));
        this.renderer_fg.setClearColor( 0x000000, 0 ); // the default

        window.addEventListener('resize', this._onWindowResize.bind(this), false);
        window.addEventListener('orientationchange', this._onWindowResize.bind(this), false);
        this._onWindowResize();

        this.container_bg.appendChild(this.renderer_bg.domElement);
        this.container_fg.appendChild(this.renderer_fg.domElement);

        // raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(0);

        // Enqueue Scroll Events, since sometimes multiple scroll events are fired in a single frame
        this.scrollQueue = [];
        this.curScrollY = window.scrollY;
        this.positioningMode = 1; // 0 is Fixed, 1 is Absolute

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.elementMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, wireframe: true, opacity: 0.05, transparent: true});

        this.elementBoxes = [];
        this._recomputeElementBoxes();
        this._setScroll();

        this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 0x00ff00, wireframe: false }));
        this.cube.position.set((window.innerWidth * 0.5) / this.pixelsPerMeter, -5.0, 0.0);
        this.scene.add(this.cube);
    }


    _render() {
        // Trigger a resize event if the window size has changed
        // iOS Pinch to Zoom does not trigger a resize event
        if( window.innerWidth  != this.lastWidth || 
            window.innerHeight != this.lastHeight){
            this._onWindowResize();
        }

        if(this.renderingMode  == 2){
            this.camera.near = this.cameraDepth;
            this.camera.far = 1000;
            this.camera.updateProjectionMatrix();
            this.renderer_bg.render(this.scene, this.camera);

            this.camera.near = 2.0;
            this.camera.far  = this.cameraDepth + 0.01;
            this.camera.updateProjectionMatrix();
            this.renderer_fg.render(this.scene, this.camera);
        }else{
            this.camera.near = 2.0;
            this.camera.far = 1000;
            this.camera.updateProjectionMatrix();
            if(this.renderingMode == 0){
                this.renderer_bg.render(this.scene, this.camera);
                this.renderer_fg.clear();
            }else{
                this.renderer_bg.clear();
                this.renderer_fg.render(this.scene, this.camera);
            }
        }
    }

    _setScroll(){
        this.curScrollX = window.scrollX;
        this.curScrollY = window.scrollY;
        this.camera.position.set( (this.curScrollX + (window.innerWidth * 0.5)) / this.pixelsPerMeter,
                                 -(this.curScrollY + (window.innerHeight * 0.5)) / this.pixelsPerMeter, this.cameraDepth); // - (window.innerWidth  * 0.5)

        this._render(this.scene, this.camera);
        if(this.positioningMode == 1){
            this.container_bg.style.position = "absolute";
            this.container_fg.style.position = "absolute";
            this.container_bg.style.transform = "translate("+this.curScrollX+"px, "+this.curScrollY+"px)";
            this.container_fg.style.transform = "translate("+this.curScrollX+"px, "+this.curScrollY+"px)";
        }else{
            this.container_bg.style.position = "fixed";
            this.container_fg.style.position = "fixed";
            this.container_bg.style.transform = "translate(0px, 0px)";
            this.container_fg.style.transform = "translate(0px, 0px)";
        }
    }

    _recomputeElementBoxes(){
        if(!this.elementBoxes){ this.elementBoxes = []; }

        let elements = document.getElementsByTagName('p');
        for(let i = 0; i < elements.length; i++){
            if(i >= this.elementBoxes.length){
                let cube = new THREE.Mesh(this.boxGeometry, this.elementMaterial);
                this.scene.add(cube);
                this.elementBoxes.push(cube);
            }

            let rect = elements[i].getBoundingClientRect();
            this.elementBoxes[i].position.set(
                (rect.left + window.scrollX + (rect.width  * 0.5)) /  this.pixelsPerMeter,
                (rect.top  + window.scrollY + (rect.height * 0.5)) / -this.pixelsPerMeter, 0.0);
            this.elementBoxes[i].scale.set(rect.width / this.pixelsPerMeter, rect.height / this.pixelsPerMeter, 0.5);
            this.elementBoxes[i].element = elements[i];
        }
    }

    _recomputePixelsPerMeter(){
        // Calculate the camera movement required to follow the scroll
        let oldPosition = this.camera.position.clone();
        this.camera.position.set(0.0, 0.0, this.cameraDepth);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
        this.derp = new THREE.Vector3(0.0, 0, 0.0);
        this.derp.project(this.camera);
        this.derp.y = 1.0/window.innerHeight;
        this.derp.unproject(this.camera);
        this.camera.position.copy(oldPosition);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
        this.pixelsPerMeter = 1.0 / (this.derp.y * 2.0);
        return this.pixelsPerMeter;
    }

    _forcePixelsPerMeter(){
        for(let i = 0; i < 10; i++){
            let curPixelsPerMeter = this._recomputePixelsPerMeter();
            // This is more compelling, but breaks the near clipping plane when zoomed in...
            //this.cameraDepth *= curPixelsPerMeter / this.forcedPixelsPerMeter;
            this.camera.fov *= curPixelsPerMeter / this.forcedPixelsPerMeter;
            this.camera.updateProjectionMatrix();
        }
    }

    /** **INTERNAL**: This function recalculates the viewport based on the new window size. */
    _onWindowResize() {
        let width = window.innerWidth, height = window.innerHeight;
        if(this.lastWidth != width || this.lastHeight != height){
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer_bg.setSize(width, height);
            this.renderer_fg.setSize(width, height);
            this.lastWidth  = width;
            this.lastHeight = height;
            this._forcePixelsPerMeter();
            this._recomputeElementBoxes();
        }
        this._setScroll();
    }

}