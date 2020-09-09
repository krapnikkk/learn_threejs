function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();


    var camera = initCamera();

    camera.position.set(-20, 50, 40);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000000));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMapEnabled = true;

    var canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setSize(window.innerWidth, window.innerHeight);

    var renderer = webGLRenderer;

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
    var scene = new THREE.Scene();

    var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x777777 }));
    groundMesh.rotation.x = -Math.PI / 2
    groundMesh.position.y = -20;
    scene.add(groundMesh);

    var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    var meshMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        name: "Basic Material",
        flatShading: true
    });

    var sphere = new THREE.Mesh(sphereGeometry, meshMaterial),
        cube = new THREE.Mesh(cubeGeometry, meshMaterial),
        plane = new THREE.Mesh(planeGeometry, meshMaterial);

    sphere.position.set(0, 3, 2);
    cube.position = plane.position = sphere.position;
    scene.add(cube);

    

    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById("webgl-output").appendChild(renderer.domElement);

    var controls = setupControls();
    var selectedMesh = cube;

    renderScene();

    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        selectedMesh.rotation.y += controls.rotationSpeed;

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        canvasRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    function setupControls() {
        var gui = new dat.GUI();
        var controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            color: meshMaterial.color.getStyle(),
            selectedMesh: 'cube',
            switchRenderer: function () {
                if (renderer instanceof THREE.WebGLRenderer) {
                    renderer = canvasRenderer;
                    document.getElementById('webgl-output').innerHTML = "";
                    document.getElementById("webgl-output").appendChild(renderer.domElement);
                } else {
                    renderer = webGLRenderer;
                    document.getElementById('webgl-output').innerHTML = "";
                    document.getElementById("webgl-output").appendChild(renderer.domElement);
                }
            }
        };
        gui.add(controls, 'switchRenderer');
        addBasicMaterialSettings(gui, controls, meshMaterial);

        var spGui = gui.addFolder("THREE.MeshBasicMaterial");
        spGui.addColor(controls, 'color').onChange(function (e) {
            meshMaterial.color.setStyle(e)
        });
        spGui.add(meshMaterial, 'wireframe');
        spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
        spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
            meshMaterial.wireframeLinejoin = e
        });
        spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
            meshMaterial.wireframeLinecap = e
        });

        loadGopher(meshMaterial).then(function (gopher) {
            gopher.scale.x = 4;
            gopher.scale.y = 4;
            gopher.scale.z = 4;
            gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

                scene.remove(plane);
                scene.remove(cube);
                scene.remove(sphere);
                scene.remove(gopher);

                switch (e) {
                    case "cube":
                        scene.add(cube);
                        selectedMesh = cube;
                        break;
                    case "sphere":
                        scene.add(sphere);
                        selectedMesh = sphere;
                        break;
                    case "plane":
                        scene.add(plane);
                        selectedMesh = plane;
                        break;
                    case "gopher":
                        scene.add(gopher);
                        selectedMesh = gopher;
                        break;
                }
            })
        })

        return controls;
    }
}

