function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();
    camera.position.set(-80, 80, 80);

    var renderer = initRenderer();

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
    var scene = new THREE.Scene();

    var textureGrass = new THREE.TextureLoader().load("../assets/textures/ground/grasslight-big.jpg");
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(10, 10);


    var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, 5, 10);
    sphere.castShadow = true;
    scene.add(sphere);

    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);//地面发出的光线颜色 天空发出的光线颜色 光线照射的强度
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    var pointColor = "#ffffff";
    var dirLight = new THREE.DirectionalLight(pointColor);
    dirLight.position.set(30, 10, -50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.width = 2048;
    dirLight.shadow.camera.height = 2048;
    scene.add(dirLight);

    var step = 0;

    var controls = setupControls();

    renderScene();

    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth, innerHeight);
    }

    function setupControls() {
        var gui = new dat.GUI();
        var controls = {
            rotationSpeed:0.03,
            bouncingSpeed:0.03,
            hemisphere: true,
            color: 0x0000ff,
            groundColor: 0x00ff00,
            intensity: 0.6
        };
        gui.add(controls, 'hemisphere').onChange((e) => {
            if (!e) {
                hemiLight.intensity = 0;
            } else {
                hemiLight.intensity = controls.intensity;
            }
        });
        gui.addColor(controls, 'groundColor',).onChange((e) => {
            hemiLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'color').onChange(function (e) {
            hemiLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            hemiLight.intensity = e;
        });

        return controls;
    }
}

