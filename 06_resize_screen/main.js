function init() {
    console.log("Using Three.js version: " + THREE.REVISION);

    window.addEventListener('resize',onResize,false);

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
    var planeGeometry = new THREE.PlaneGeometry(60, 20);//宽度和高度
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });//Lambert网格材质
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);//网格对象
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0XFF0000, });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;//开启阴影功能
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    var ambienLight = new THREE.AmbientLight(0x353535);//环境光线
    scene.add(ambienLight);

    document.querySelector("#webgl-output").appendChild(renderer.domElement);
    // renderer.render(scene, camera);

    var trackballControls = initTrackballControls(camera,renderer);
    var clock = new THREE.Clock();
    

    var step = 0;
    var controls = {
        rotationSpeed : 0.02,
        bouncingSpeed : 0.03
    }
    var gui = new dat.GUI();
    gui.add(controls,'rotationSpeed',0,0.5);
    gui.add(controls,'bouncingSpeed',0,0.5);


    renderScene();
    function renderScene(){
        trackballControls.update(clock.getDelta());
        stats.update();

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + 10 * (Math.cos(step));
        sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

        requestAnimationFrame(renderScene);
        renderer.render(scene,camera);
    }

    function onResize(){
        camera.aspect = window.innerWidth/window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth,innerHeight);
    }
}

