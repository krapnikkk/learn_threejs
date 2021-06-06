function init() {
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.NRRDLoader();

  loader.load("../../assets/models/nrrd/I.nrrd", function (volume) {
    var sliceZ = volume.extractSlice('z',Math.floor(volume.RASDimensions[2]/4));

    loaderScene.render(sliceZ.mesh, camera);
  });

}