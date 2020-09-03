function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;//开启阴影效果

    //创建坐标轴对象，轴线设置粗细值20
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    //创建平面对象
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);//宽度和高度
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });//Lambert网格材质
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);//网格对象
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    var ambienLight = new THREE.AmbientLight(0x353535);//环境光线
    scene.add(ambienLight);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;//开启阴影功能
    scene.add(spotLight);

    
    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100);//场景雾化[浓度呈线性增长]
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);//雾的浓度随距离呈指数增长

    document.querySelector("#webgl-output").appendChild(renderer.domElement);
    // renderer.render(scene, camera);

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();


    var step = 0;
    var controls = {
        rotationSpeed: 0.02,
        numberOfObject: scene.children.length + "",
        addCube: function () {
            var cubeSize = Math.ceil(Math.random() * 3);
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMatarial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xfffff });
            var cube = new THREE.Mesh(cubeGeometry, cubeMatarial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;
            cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
            cube.position.y = Math.round(Math.random() * 5);
            cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);
            scene.add(cube);
            this.numberOfObject = scene.children.length + "";
        },
        remove: function () {
            var allchildren = scene.children;
            var lastObject = allchildren[allchildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObject = scene.children.length + "";
            }
        },
        logObjects: function () {
            console.log(scene.children);
        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'numberOfObject');
    gui.add(controls, 'addCube');
    gui.add(controls, 'remove');
    gui.add(controls, 'logObjects').listen();


    renderScene();
    function renderScene() {
        trackballControls.update(clock.getDelta());
        stats.update();

        scene.traverse((e) => {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        })

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth, innerHeight);
    }
}

