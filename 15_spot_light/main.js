function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();
    var renderer = initRenderer();

    var scene = new THREE.Scene();
    var cubeAndSphere = addDefaultCubeAndSphere(scene);
    var cube = cubeAndSphere.cube,
        sphere = cubeAndSphere.sphere;
    var plane = addGroundPlane(scene);

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);//环境光线
    scene.add(ambientLight);

    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    var spotLight = new THREE.SpotLight("#ffffff");
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;//投影近点
    spotLight.shadow.camera.far = 100;//投影远点
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.angle = 0.4;
    spotLight.shadow.camera.fov = 120;//投影视场
    scene.add(spotLight);
    var debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);//调试阴影

    var pp = new THREE.SpotLightHelper(spotLight);//调试光源
    scene.add(pp);

    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);

    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
    scene.add(sphereLightMesh);

    var step = 0,
        invert = 1,
        phase = 0;

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var controls = setupControls()

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

        if (!controls.stopMovingLight) {
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }

            sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 15;

            if (invert < 0) {
                var pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }

            spotLight.position.copy(sphereLightMesh.position);
        }

        pp.update();

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
            ambiColor: ambiColor,
            pointColor: spotLight.color.getStyle(),
            intensity: 1,
            distance: 0,
            angle: 0.1,
            showDebug: false,
            castShadow: true,
            target: 'Plane',
            stopMovingLight: false,
            penumbra: 0
        };
        gui.addColor(controls, 'ambiColor').onChange((e) => {
            ambientLight.color = new THREE.Color(e);
        });
        gui.addColor(controls, 'pointColor',).onChange((e) => {
            spotLight.color = new THREE.Color(e);
        });

        gui.add(controls, "angle", 0, Math.PI * 2).onChange((e) => {
            spotLight.angle = e;
        })

        gui.add(controls, "intensity", 0, 5).onChange((e) => {
            spotLight.intensity = e;
        })

        gui.add(controls, "penumbra", 0, 1).onChange((e) => {
            spotLight.penumbra = e;
        })

        gui.add(controls, "distance", 0, 200).onChange((e) => {
            spotLight.distance = e;
        })

        gui.add(controls, "showDebug").onChange((e) => {
            if (e) {
                scene.add(debugCamera);
            } else {
                scene.remove(debugCamera);
            }
        })

        gui.add(controls, "castShadow").onChange((e) => {
            spotLight.castShadow = e;
        })

        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube', 'target']).onChange(function (e) {
            switch (e) {
                case "Plane":
                    spotLight.target = plane;
                    break;
                case "Sphere":
                    spotLight.target = sphere;
                    break;
                case "Cube":
                    spotLight.target = cube;
                    break;
                case "target":
                    spotLight.target = target;
            }

        });

        gui.add(controls, 'stopMovingLight').onChange(function (e) {
            stopMovingLight = e;
        });

        return controls;
    }
}

