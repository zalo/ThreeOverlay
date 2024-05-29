import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

/** The fundamental set up and animation structures for 3D Visualization */
export default class World {

    constructor(mainObject) { this._setupWorld(mainObject); }

    /** **INTERNAL**: Set up a basic world */
    _setupWorld(mainObject) {
        this.container_bg = document.getElementById('appbody-bg');
        this.container_fg = document.getElementById('appbody-fg');
        
        // camera and world
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 2.0, 1000 );
        this.camera.position.set( 0.0, 0.0, 5.0 );
        this.camera.layers.enableAll();
        this.scene.add(this.camera);

        this._recomputePixelsPerMeter();

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

        this.helper0 = new THREE.GridHelper( 20, 20 );
        this.helper0.material.opacity = 0.2;
        this.helper0.material.transparent = true;
        this.helper0.position.set(0, 5.0, 0);
        this.scene.add( this.helper0 );

        this.helper = new THREE.GridHelper( 20, 20 );
        this.helper.material.opacity = 0.2;
        this.helper.material.transparent = true;
        this.helper.position.set(0, 0.0, 0);
        this.scene.add( this.helper );

        this.helper2 = new THREE.GridHelper( 20, 20 );
        this.helper2.material.opacity = 0.2;
        this.helper2.material.transparent = true;
        this.helper2.position.set(0, -5.0, 0);
        this.scene.add( this.helper2 );

        this.helper3 = new THREE.GridHelper( 20, 20 );
        this.helper3.material.opacity = 0.2;
        this.helper3.material.transparent = true;
        this.helper3.position.set(0, -10.0, 0);
        this.scene.add( this.helper3 );

        this.renderingMode = 2;

        // renderer
        this.renderer_bg = new THREE.WebGLRenderer( { antialias: true } ); //, alpha: true
        this.renderer_bg.setPixelRatio( Math.max(window.devicePixelRatio, 1));
        this.renderer_bg.shadowMap.enabled = true;
        this.renderer_bg.setAnimationLoop(mainObject.update.bind(mainObject));
        this.renderer_bg.setClearColor( 0x000000, 0 ); // the default

        this.renderer_fg = new THREE.WebGLRenderer( { antialias: true } ); //, alpha: true
        this.renderer_fg.setPixelRatio( Math.max(window.devicePixelRatio, 1));
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

        this.alreadyRendered = false;
        window.addEventListener("scroll", (event) => {
            this._setScroll();
        });

        // stats
        this.stats = new Stats();
        this.container_bg.appendChild(this.stats.dom);

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.elementMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, wireframe: true, opacity: 0.05, transparent: true});

        this.elementBoxes = [];
        this._recomputeElementBoxes();
    }

    _render() {
        if(this.renderingMode  == 2){
            this.camera.near = 5.0;
            this.camera.far = 1000;
            this.camera.updateProjectionMatrix();
            this.renderer_bg.render(this.scene, this.camera);

            this.camera.near = 2.0;
            this.camera.far  = 5.01;
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
        this.camera.position.set(0.0, -(window.scrollY + (window.innerHeight *0.5)) / this.pixelsPerMeter, 5.0);
        this._render(this.scene, this.camera);
        this.alreadyRendered = true;
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
            this.elementBoxes[i].position.set(0.0, (rect.top + window.scrollY + (rect.height * 0.5)) / -this.pixelsPerMeter, 0.0);
            this.elementBoxes[i].scale.set(rect.width / this.pixelsPerMeter, rect.height / this.pixelsPerMeter, 0.5);
            this.elementBoxes[i].element = elements[i];
        }
    }

    _recomputePixelsPerMeter(){
        // Calculate the camera movement required to follow the scroll
        let oldPosition = this.camera.position.clone();
        this.camera.position.set(0.0, 0.0, 5.0);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
        this.derp = new THREE.Vector3(0.0, 0, 0.0);
        this.derp.project(this.camera);
        this.derp.y = 1.0/window.innerHeight;
        this.derp.unproject(this.camera);
        this.pixelsPerMeter = 1.0 / (this.derp.y * 2.0);
        this.camera.position.copy(oldPosition);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
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
            this._recomputePixelsPerMeter();
            this._recomputeElementBoxes();
        }
        this._setScroll();
    }

}