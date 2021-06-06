function init() {
    var camera = initCamera(new THREE.Vector3(35, 35, 35));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 45, 0));

    var mtlLoader = new THREE.ColladaLoader();
    mtlLoader.load("../assets/models/medieval/medieval_building.DAE", (res) => {
        var sceneGroup = res.scene;
        sceneGroup.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                child.castShow = true;
            } else {
                sceneGroup.remove(child);
            }
        })
        sceneGroup.rotation.z = 0.5 * Math.PI;
        sceneGroup.scale.set(8, 8, 8);
        loaderScene.render(sceneGroup, camera);
    })

}