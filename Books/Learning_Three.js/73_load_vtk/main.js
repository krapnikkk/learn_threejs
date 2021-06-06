function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var mtlLoader = new THREE.VTKLoader();
    mtlLoader.load("../assets/models/moai/moai_fixed.vtk", (geom) => {
        var mat = new THREE.MeshNormalMaterial();
        geom.center();
        geom.computeVertexNormals();

        var group = new THREE.Mesh(geom, mat);
        group.scale.set(25, 25, 25);
        loaderScene.render(group, camera);
    })

}