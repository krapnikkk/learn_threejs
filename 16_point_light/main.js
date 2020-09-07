function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();
    var renderer = initRenderer();

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var scene = new THREE.Scene();
    addHouseAndTree(scene);

    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);//环境光线
    scene.add(ambientLight);

    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.decay = 0.1;
    pointLight.castShadow = true;
    scene.add(pointLight);

    var helper = new THREE.PointLightHelper(pointLight);

    var shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);//调试阴影


    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

    sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
    scene.add(sphereLightMesh);

    var step = 0,
        invert = 1,
        phase = 0;



    var controls = setupControls()

    renderScene();

    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        helper.update();
        shadowHelper.update();
        pointLight.position.copy(sphereLightMesh.position);

        if (phase > 2 * Math.PI) {
            invert = invert * -1;
            phase -= 2 * Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.z = +(25 * (Math.sin(phase)));
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 5;

        if (invert < 0) {
            var pivot = 14;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

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
            rotationSpeed: 0.01,
            bouncingSpeed: 0.03,
            ambientLight: ambientLight.color.getStyle(),
            pointColor: pointLight.color.getStyle(),
            intensity: 1,
            distance: pointLight.distance,
        };
        gui.addColor(controls, 'ambientLight').onChange((e) => {
            ambientLight.color = new THREE.Color(e);
        });
        gui.addColor(controls, 'pointColor',).onChange((e) => {
            pointLight.color = new THREE.Color(e);
        });

        gui.add(controls, "distance", 0, 200).onChange((e) => {
            pointLight.distance = e;
        })

        return controls;
    }
}

