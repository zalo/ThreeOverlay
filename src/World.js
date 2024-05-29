import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

/** The fundamental set up and animation structures for 3D Visualization */
export default class World {

    constructor(mainObject) { this._setupWorld(mainObject); }

    /** **INTERNAL**: Set up a basic world */
    _setupWorld(mainObject) {
        // app container div
        this.container = document.getElementById('appbody');
        
        // camera and world
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0, 0, 0, 0);

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1.0, 1000 );
        this.camera.position.set( 0.0, 1, -2 );
        this.camera.layers.enableAll();
        this.scene.add(this.camera);

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

        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry( 20, 20, 1, 1 ),
            new THREE.MeshPhongMaterial( { color: 0xa0adaf, shininess: 150 } )
        );				

        //this.ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        //this.ground.receiveShadow = true;
        //this.scene.add( this.ground );
        
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
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setAnimationLoop(mainObject.update.bind(mainObject));
        this.renderer.setClearColor( 0x35363e, 0 ); // the default
        window.addEventListener('resize', this._onWindowResize.bind(this), false);
        window.addEventListener('orientationchange', this._onWindowResize.bind(this), false);
        this._onWindowResize();

        //this.draggableObjects = [];
        //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.target.set(0, 1, 0);
        //this.controls.panSpeed = 2;
        //this.controls.zoomSpeed = 1;
        //this.controls.enableDamping = true;
        //this.controls.dampingFactor = 0.10;
        //this.controls.screenSpacePanning = true;
        //this.controls.update();
        //this.controls.addEventListener('change', () => this.viewDirty = true);

        // raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(0);

        // stats
        this.stats = new Stats();
        this.stats.dom.style.transform = "scale(0.7);";
        this.container.appendChild(this.stats.dom);

        // Temp variables to reduce allocations
        this.mat  = new THREE.Matrix4();
        this.vec = new THREE.Vector3();
        this.zVec = new THREE.Vector3(0, 0, 1);
        this.quat = new THREE.Quaternion().identity();
        this.color = new THREE.Color();

    }

    /** **INTERNAL**: This function recalculates the viewport based on the new window size. */
    _onWindowResize() {
        let width = window.innerWidth, height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        if (this.webcamera) {
            this.webcamera.camera.aspect = width / height;
            this.webcamera.camera.updateProjectionMatrix();
        }
        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);
    }

}