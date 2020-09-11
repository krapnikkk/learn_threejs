function init() {

    // use the defaults
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();
    addLargeGroundPlane(scene);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    scene.add(spotLight);

    var material = new THREE.MeshStandardMaterial({ color: 0x7777ff })
    var controls = {
        color: material.color.getStyle(),
        emissive: material.emissive.getStyle(),//自发光
    };

    var gui = new dat.GUI();
    var step = 0;
    addBasicMaterialSettings(gui, controls, material);
    addMeshSelection(gui, controls, material, scene);
    var spGui = gui.addFolder("THREE.MeshStandardMaterial");
    spGui.addColor(controls, 'color').onChange(function (e) {
        material.color.setStyle(e)
    });
    spGui.addColor(controls, 'emissive').onChange(function (e) {
        material.emissive = new THREE.Color(e);
    });
    spGui.add(material, 'metalness', 0, 1, 0.01)//金属感程度
    spGui.add(material, 'roughness', 0, 1, 0.01)//粗糙程度
    spGui.add(material, 'wireframe');
    spGui.add(material, 'wireframeLinewidth', 0.1, 20);

    camera.lookAt(controls.selected.position);
    render();

    function render() {
        stats.update();

        if (controls.selected) controls.selected.rotation.y = step += 0.01;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}