import * as THREE from '../node_modules/three/build/three.module.js';
import { GUI } from '../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import World from './World.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';

/** The fundamental set up and animation structures for 3D Visualization */
export default class Main {

    constructor() {
        // Intercept Main Window Errors
        window.realConsoleError = console.error;
        window.addEventListener('error', (event) => {
            let path = event.filename.split("/");
            this.display((path[path.length - 1] + ":" + event.lineno + " - " + event.message));
        });
        console.error = this.fakeError.bind(this);
        this.physicsScene = { softBodies: [] };
        this.deferredConstructor();
    }
    async deferredConstructor() {
        // Configure Settings
        this.meshingParams = {
            RemeshResolution : 20,
            TargetTriangles  : 2000,
            MaxTriangleEdgeLength: 50.0,
            MinTetVolume: 0.01,
            ShowTetMesh      : true,
        };
        //this.gui = new GUI();
        //this.gui.add(this.meshingParams, 'RemeshResolution', 0, 50, 1).onFinishChange((value) => {
        //    if(this.mesh){ this.generateTetMesh(this.mesh); }});
        //this.gui.add(this.meshingParams, 'TargetTriangles', 100, 5000, 100).onFinishChange((value) => {
        //    if(this.mesh){ this.generateTetMesh(this.mesh); }});
        //this.gui.add(this.meshingParams, 'MaxTriangleEdgeLength').onFinishChange((value) => {
        //    if(this.mesh){ this.generateTetMesh(this.mesh); }});
        //this.gui.add(this.meshingParams, 'MinTetVolume').onFinishChange((value) => {
        //    if(this.mesh){ this.generateTetMesh(this.mesh); }});

        // Construct the render world
        this.world = new World(this);

        this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 0x00ff00, wireframe: false }));
        this.cube.position.set(0.0, 0.0, 0.0);
        this.world.scene.add(this.cube);

        window.addEventListener("scroll", (event) => {
            this.world.camera.position.set(0.0, window.scrollY/100.0, 5.0);
        });
    }

    /** Update the simulation */
    update() {
        //this.world.controls.update();
        //console.log(window.scrollY);
        this.world.camera.position.set(0.0, -window.scrollY/100.0, 5.0);

        this.world.renderer.render(this.world.scene, this.world.camera);
        this.world.stats.update();
    }

    // Log Errors as <div>s over the main viewport
    fakeError(...args) {
        if (args.length > 0 && args[0]) { this.display(JSON.stringify(args[0])); }
        window.realConsoleError.apply(console, arguments);
    }

    display(text) {
        let errorNode = window.document.createElement("div");
        errorNode.innerHTML = text.fontcolor("red");
        window.document.getElementById("info").appendChild(errorNode);
    }
}

var main = new Main();
