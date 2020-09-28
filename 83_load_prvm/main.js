function init() {
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.PRWMLoader();

  loader.load("../assets/models/cerberus/cerberus.be.prwm", function (geometry) {
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    mesh.scale.set(30, 30, 30)
    loaderScene.render(mesh, camera);
  });

}