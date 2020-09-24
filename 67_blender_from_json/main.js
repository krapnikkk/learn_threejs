function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 15, 0));
    var loader = new THREE.JSONLoader();
    loader.load('../assets/models/house/house.json', (geom, mat) => {
        var mesh = new THREE.Mesh(geom, mat[0]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        loaderScene.render(mesh, camera);
    })
}