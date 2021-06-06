function init() {
    var camera = initCamera(new THREE.Vector3(30, 30, 30));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var loader = new THREE.AMFLoader();
    loader.load("../assets/models/gimbal/Gimbal_snowflake_star_small_hole_6mm.amf", function (group) {
      group.scale.set(0.4, 0.4, 0.4);
      loaderScene.render(group, camera);
    });

}