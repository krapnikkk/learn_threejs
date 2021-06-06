function init() {
    var camera = initCamera(new THREE.Vector3(30, 30, 30));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var loader = new THREE.ThreeMFLoader();
    loader.load("../assets/models/gears/dodeca_chain_loop.3mf", function (group) {
      group.scale.set(0.1, 0.1, 0.1);
      loaderScene.render(group, camera);
    });

}