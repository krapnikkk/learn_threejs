function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var projector = new THREE.Scene();
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  // var trackballControls = initTrackballControls(camera, renderer);
  // var clock = new THREE.Clock();

  initDefaultLighting(scene);

  var groundPlane = addGroundPlane(scene)
  groundPlane.position.y = 0;

  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.set(-10, 4, 0);
  scene.add(cube);

  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(20, 0, 2);
  sphere.castShadow = true;
  scene.add(sphere);

  var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
  var cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x77ff77 });
  var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.position.set(0, 0, 1);

  scene.add(cylinder);

  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);
  var ambientLight = new THREE.AmbientLight(0x353535);
  scene.add(ambientLight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var step = 0, scalingStep = 0, tube;
  var controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
    scalingSpeed: 0.03,
    showRay: false
  }

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'bouncingSpeed', 0, 0.5);
  gui.add(controls, 'scalingSpeed', 0, 0.5);
  gui.add(controls, 'showRay').onChange((e) => {
    if (tube) {
      scene.remove(tube);
    }
  });

  renderScene();

  function renderScene() {
    stats.update();
    // trackballControls.update(clock.getDelta());

    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    scalingStep += controls.scalingSpeed;
    var scaleX = Math.abs(Math.sin(scalingStep / 4));
    var scaleY = Math.abs(Math.cos(scalingStep / 5));
    var scaleZ = Math.abs(Math.sin(scalingStep / 7));
    cylinder.scale.set(scaleX, scaleY, scaleZ);

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  var projector = new THREE.Projector();
  function onDocumentMouseDown(e) {
    var vector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

    if (intersects.length > 0) {
      console.log(intersects[0]);
      intersects[0].object.material.transparent = true;
      intersects[0].object.material.opacity = 0.1;
    }
  }

  function onDocumentMouseMove(e) {
    if (controls.showRay) {
      var vector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
      vector = vector.unproject(camera);

      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

      if (intersects.length > 0) {

        var points = [];
        points.push(new THREE.Vector3(-30, 39.8, 30));
        points.push(intersects[0].point);

        var mat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
        var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);

        if (tube)
          scene.remove(tube);


        tube = new THREE.Mesh(tubeGeometry, mat);
        scene.add(tube);

      }
    }
  }

}