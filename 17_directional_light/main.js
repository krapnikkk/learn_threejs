function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();
    camera.position.set(-80, 80, 80);

    var renderer = initRenderer();

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var scene = new THREE.Scene();

    var planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, -5, 0);
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.set(-4,3,0);
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;

    scene.add(sphere);

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);//环境光线
    scene.add(ambientLight);

    var pointColor = "#ff5808";
    var directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 80;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;

    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);
    directionalLight.target = target;

    var shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);//调试阴影

    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;
    sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
    scene.add(sphereLightMesh);

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

        sphereLightMesh.position.z = -8;
        sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
        sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

        directionalLight.position.copy(sphereLightMesh.position);

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
            ambientColor: ambientLight.color.getStyle(),
            pointColor: directionalLight.color.getStyle(),
            intensity: 0.5,
            debug: false,
            castShadow: true,
            onlyShadow: false,
            target: 'Plane'
        };
        gui.addColor(controls, 'ambientColor').onChange((e) => {
            ambientLight.color = new THREE.Color(e);
        });
        gui.addColor(controls, 'pointColor',).onChange((e) => {
            directionalLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            directionalLight.intensity = e;
        });

        gui.add(controls, 'debug').onChange(function (e) {
            e ? scene.add(shadowHelper) : scene.remove(shadowHelper);
        });

        gui.add(controls, 'castShadow').onChange(function (e) {
            directionalLight.castShadow = e;
        });

        gui.add(controls, 'onlyShadow').onChange(function (e) {
            directionalLight.onlyShadow = e;
        });

        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube', 'target']).onChange(function (e) {
            switch (e) {
                case "Plane":
                    directionalLight.target = plane;
                    break;
                case "Sphere":
                    directionalLight.target = sphere;
                    break;
                case "Cube":
                    directionalLight.target = cube;
                    break;
                case "target":
                    directionalLight.target = target;
                    break;
            }
        })

        return controls;
    }
}

