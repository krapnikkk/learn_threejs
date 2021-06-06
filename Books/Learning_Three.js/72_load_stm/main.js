function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var mtlLoader = new THREE.CTMLoader();
    mtlLoader.load("../assets/models/wheel/auditt_wheel.ctm", (geom) => {
        var mat = new THREE.MeshLambertMaterial({
            color: 0x888888
        });
        var group = new THREE.Mesh(geom, mat);
        group.scale.set(70, 70, 70);
        loaderScene.render(group, camera);
    })

}