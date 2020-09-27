function init() {
    var camera = initCamera(new THREE.Vector3(50, 50, 50));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 15, 0));
    var loader = new THREE.OBJLoader();
    loader.load('../assets/models/pinecone/pinecone.obj', (mesh) => {
        var material = new THREE.MeshLambertMaterial({
            color: 0x5C3A21
        });

        mesh.children.forEach((child) => {
            child.material = material;
            child.geometry.computeVertexNormals();
            child.geometry.computeFaceNormals();
        })
        mesh.scale.set(120, 120, 120);

        loaderScene.render(mesh, camera);
    })
}