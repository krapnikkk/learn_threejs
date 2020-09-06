function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(120, 60, 180);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;//开启阴影效果

    //创建平面对象
    var planeGeometry = new THREE.PlaneGeometry(180, 180);//宽度和高度
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });//Lambert网格材质
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);//网格对象
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    for (var j = 0; j < (planeGeometry.parameters.height / 5); j++) {
        for (var i = 0; i < (planeGeometry.parameters.width / 5); i++) {
            var rnd = Math.random() * 0.75 + 0.25;
            var cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color = new THREE.Color(rnd, 0, 0);
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + (j * 5);
            cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + (i * 5);
            cube.position.y = 2;
            scene.add(cube);
        }
    }

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);//平行光
    directionalLight.position.set(-20, 40, 60);
    scene.add(directionalLight);

    var ambienLight = new THREE.AmbientLight(0x292929);//环境光线
    scene.add(ambienLight);

    document.querySelector("#webgl-output").appendChild(renderer.domElement);


    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var gui = new dat.GUI();
    var controls = {
        perspective: "Perspective",
        switchCamera: function () {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                camera.position.set(120, 60, 180);
                camera.lookAt(scene.position);
                trackballControls = initTrackballControls(camera, renderer);
                this.perspective = "Orthographic"
            } else {
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(120, 60, 180);
                camera.lookAt(scene.position);
                trackballControls = initTrackballControls(camera, renderer);
                this.perspective = "Perspective"
            }
        }
    };
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();


    renderScene();
    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth, innerHeight);
    }
}

