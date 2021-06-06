function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var loader = new THREE.VRMLLoader();
    loader.load("../../assets/models/tree/tree.wrl", function (model) {
        model.scale.set(10, 10, 10);
        loaderScene.render(model, camera);
    });

}