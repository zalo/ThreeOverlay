# [ThreeOverlay](https://zalo.github.io/ThreeOverlay/)

<p align="left">
  <a href="https://github.com/zalo/ThreeOverlay/deployments/activity_log?environment=github-pages">
      <img src="https://img.shields.io/github/deployments/zalo/ThreeOverlay/github-pages?label=Github%20Pages%20Deployment" title="Github Pages Deployment"></a>
  <a href="https://github.com/zalo/ThreeOverlay/commits/master">
      <img src="https://img.shields.io/github/last-commit/zalo/ThreeOverlay" title="Last Commit Date"></a>
  <!--<a href="https://github.com/zalo/ThreeOverlay/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/zalo/ThreeOverlay" title="License: Apache V2"></a>-->  <!-- No idea what license this should be! -->
</p>

Generate Tetrahedral FEM Meshes in your browser using [physx-js-webidl](https://github.com/fabmax/physx-js-webidl/)!

This project is largely a toy/proof of concept; meant to explore TetMesh Generation in the browser for https://github.com/zalo/TetSim/

 # Building

This demo can either be run without building (in Chrome/Edge/Opera since raw three.js examples need [Import Maps](https://caniuse.com/import-maps)), or built with:
```
npm install
npm run build
```
After building, make sure to edit the index .html to point from `"./src/main.js"` to `"./build/main.js"`.

 # Dependencies
 - [physx-js-webidl](https://github.com/fabmax/physx-js-webidl/) (Tetrahedral Meshing Backend)
 - [three.js](https://github.com/mrdoob/three.js/) (3D Rendering Engine)
 - [esbuild](https://github.com/evanw/esbuild/) (Bundler)
