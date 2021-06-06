function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();
    var camera = initCamera();
    var renderer = initRenderer();

    var scene = new THREE.Scene();

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
    var scene = new THREE.Scene();

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var group = new THREE.Mesh();
    var mats = [];
    mats.push(new THREE.MeshBasicMaterial({
        color: 0x009e60
    }))
    mats.push(new THREE.MeshBasicMaterial({
        color: 0x0051ba
    }))
    mats.push(new THREE.MeshBasicMaterial({
        color: 0xffd500
    }))
    mats.push(new THREE.MeshBasicMaterial({
        color: 0xff5800
    }))
    mats.push(new THREE.MeshBasicMaterial({
        color: 0xC41E3A
    }))
    mats.push(new THREE.MeshBasicMaterial({
        color: 0xffffff
    }))

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            for (var z = 0; z < 3; z++) {
                var cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                var cube = new THREE.Mesh(cubeGeom, mats);
                cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
                group.add(cube);
            }
        }
    }

    group.scale.copy(new THREE.Vector3(2, 2, 2));
    scene.add(group);

    var controls = setupControls();


    renderScene();

    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        group.rotation.x += controls.rotationSpeed;
        group.rotation.y += controls.rotationSpeed;
        group.rotation.z += controls.rotationSpeed;

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function setupControls() {
        var gui = new dat.GUI();
        var controls = {
            rotationSpeed: 0.02,
        };

        gui.add(controls, "rotationSpeed", 0, 0.5);
        return controls;
    }
}

