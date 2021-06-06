function init() {
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.GCodeLoader();

  loader.load("../assets/models/benchy/benchy.gcode", function (object) {
    object.scale.set(0.2, 0.2, 0.2);
    object.position.set(-20,1,1);
    loaderScene.render(object, camera);
  });

}