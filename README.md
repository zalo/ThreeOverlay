# [ThreeOverlay](https://zalo.github.io/ThreeOverlay/)

<p align="left">
  <a href="https://github.com/zalo/ThreeOverlay/deployments/activity_log?environment=github-pages">
      <img src="https://img.shields.io/github/deployments/zalo/ThreeOverlay/github-pages?label=Github%20Pages%20Deployment" title="Github Pages Deployment"></a>
  <a href="https://github.com/zalo/ThreeOverlay/commits/master">
      <img src="https://img.shields.io/github/last-commit/zalo/ThreeOverlay" title="Last Commit Date"></a>
  <!--<a href="https://github.com/zalo/ThreeOverlay/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/zalo/ThreeOverlay" title="License: Apache V2"></a>-->  <!-- No idea what license this should be! -->
</p>

WIP Framework for Rendering 3D Content Inline with Normal Text Content

 # Building

This demo can either be run without building (in Chrome/Edge/Opera since raw three.js examples need [Import Maps](https://caniuse.com/import-maps)), or built with:
```
npm install
npm run build
```
After building, make sure to edit the index .html to point from `"./src/main.js"` to `"./build/main.js"`.

 # Dependencies
 - [three.js](https://github.com/mrdoob/three.js/) (3D Rendering Engine)
 - [esbuild](https://github.com/evanw/esbuild/) (Bundler)
