function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  initDefaultLighting(scene);

  var domElement = document.querySelector("#webgl-output");
  var flyControls = new THREE.FlyControls(camera, domElement);
  flyControls.movementSpeed = 25;

  flyControls.rollSpeed = Math.PI / 24;
  flyControls.autoForward = true;
  flyControls.dragToLook = false;

  var loader = new THREE.OBJLoader();
  loader.load("../assets/models/city/city.obj", function (object) {

    var scale = chroma.scale(['red', 'green', 'blue']);
    setRandomColors(object, scale);
    mesh = object;
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    flyControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }
}
