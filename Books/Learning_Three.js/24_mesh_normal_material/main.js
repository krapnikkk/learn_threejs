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

    var meshMaterial = new THREE.MeshNormalMaterial();

    var sphere = new THREE.Mesh(sphereGeometry, meshMaterial),
        cube = new THREE.Mesh(cubeGeometry, meshMaterial),
        plane = new THREE.Mesh(planeGeometry, meshMaterial);

    sphere.position.set(0, 3, 2);
    cube.position = plane.position = sphere.position;
    scene.add(cube);
    var selectedMesh = cube;
    addArrow(selectedMesh);


    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById("webgl-output").appendChild(renderer.domElement);

    var controls = setupControls();


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
            selectedMesh: 'cube'
        };
        addBasicMaterialSettings(gui, controls, meshMaterial);

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
                addArrow(selectedMesh);

            })
        })

        return controls;
    }

    function addArrow(mesh) {
        if (mesh.children.length > 0) {
            return;
        }
        for (var f = 0, f1 = mesh.geometry.faces.length; f < f1; f++) {//为每个面增加法向量指针
            var face = mesh.geometry.faces[f];
            var centroid = new THREE.Vector3(0, 0, 0);
            centroid.add(mesh.geometry.vertices[face.a]);
            centroid.add(mesh.geometry.vertices[face.b]);
            centroid.add(mesh.geometry.vertices[face.c]);
            centroid.divideScalar(3);//计算质心

            var arrow = new THREE.ArrowHelper(face.normal, centroid, 2, 0x3333ff, 0.5, 0.5);
            mesh.add(arrow);
        }
    }
}

