function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var loader = new THREE.AssimpJSONLoader();
    loader.load("../../assets/models/spider/spider.obj.assimp.json", function (model) {
      model.scale.set(0.4, 0.4, 0.4);
      loaderScene.render(model, camera);
    });

}