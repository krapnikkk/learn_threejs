function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();
    camera.position.set(-20, 10, 45);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

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

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    var pointColor = "#ffffff";
    var spotLight = new THREE.DirectionalLight(pointColor);
    spotLight.position.set(30, 10, -50);
    spotLight.castShadow = true;
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.left = -100;
    spotLight.shadow.camera.right = 100;
    spotLight.shadow.camera.top = 100;
    spotLight.shadow.camera.bottom = -100;
    spotLight.shadow.camera.width = 2048;
    spotLight.shadow.camera.height = 2048;
    scene.add(spotLight);

    var textureFlare0 = THREE.ImageUtils.loadTexture("../assets/textures/flares/lensflare0.png");
    var textureFlare3 = THREE.ImageUtils.loadTexture("../assets/textures/flares/lensflare3.png");
    var flareColor = new THREE.Color(0xffaacc);

    var lensFlare = new THREE.Lensflare();

    lensFlare.addElement(new THREE.LensflareElement(textureFlare0, 350, 0.0, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9, flareColor));
    lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1.0, flareColor));
    spotLight.add(lensFlare);

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
            rotationSpeed: 0.03,
            bouncingSpeed: 0.03,
            ambientColor: ambiColor,
            pointColor: pointColor,
            intensity: 0.1,
            hemisphere: true,
            color: 0x0000ff,
            groundColor: 0x00ff00,
            intensity: 0.6
        };
        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function (e) {
            spotLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            spotLight.intensity = e;
        });

        return controls;
    }
}

