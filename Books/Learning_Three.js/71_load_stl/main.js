function init() {
    var camera = initCamera(new THREE.Vector3(35, 35, 35));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 45, 0));

    var mtlLoader = new THREE.STLLoader();
    mtlLoader.load("../assets/models/head/SolidHead_2_lowPoly_42k.stl", (geom) => {
        var mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            matalness: 1,
            roughness: 0.5
        });
        var group = new THREE.Mesh(geom, mat);
        group.rotation.x = -0.5 * Math.PI;
        group.scale.set(0.1, 0.1, 0.1);
        loaderScene.render(group, camera);
    })

}