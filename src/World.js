import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

/** The fundamental set up and animation structures for 3D Visualization */
export default class World {

    constructor(mainObject) { this._setupWorld(mainObject); }

    /** **INTERNAL**: Set up a basic world */
    _setupWorld(mainObject) {
        this.container = document.getElementById('appbody');
        
        // camera and world
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 2.0, 1000 );
        this.camera.position.set( 0.0, 0.0, 5.0 );
        this.camera.layers.enableAll();
        this.scene.add(this.camera);

        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        // Calculate the camera movement required to follow the scroll
        this.derp = new THREE.Vector3(0.0, 0.0, 0.0);
        this.derp.project(this.camera);
        this.derp.y = 1.0/window.innerHeight;
        this.derp.unproject(this.camera);
        this.movementPerPixel = this.derp.y * 2.0;
        console.log(this.movementPerPixel);

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

        // renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } ); //, alpha: true
        this.renderer.setPixelRatio( Math.max(window.devicePixelRatio, 1));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setAnimationLoop(mainObject.update.bind(mainObject));
        this.renderer.setClearColor( 0x000000, 0 ); // the default
        window.addEventListener('resize', this._onWindowResize.bind(this), false);
        window.addEventListener('orientationchange', this._onWindowResize.bind(this), false);
        this._onWindowResize();

        // raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(0);

        // stats
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);
    }

    /** **INTERNAL**: This function recalculates the viewport based on the new window size. */
    _onWindowResize() {
        let width = window.innerWidth, height = window.innerHeight;
        if(this.lastWidth != width || this.lastHeight != height){
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.renderer.render(this.scene, this.camera);
            this.lastWidth  = width;
            this.lastHeight = height;
        }
    }

}