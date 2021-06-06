function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera,false);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var loader = new THREE.BabylonLoader();
    var group = new THREE.Object3D();
    loader.load("../../assets/models/skull/skull.babylon", function (loadedScene) {
  
        loadedScene.children[1].material = new THREE.MeshLambertMaterial();
        loaderScene.render(loadedScene, camera);
  
    });

}