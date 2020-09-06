function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();

    var scene = new THREE.Scene();
    var camera = initCamera();
    var renderer = initRenderer();

    addHouseAndTree(scene);

    var ambientLight = new THREE.AmbientLight("#606008", 1);//环境光线
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-30, 40, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    var gui = new dat.GUI();
    var controls = {
        intensity: ambientLight.intensity,
        ambientColor: ambientLight.color.getStyle(),
        disableSpotlight: false
    };
    gui.add(controls, 'intensity',0,3,0.1).onChange((e)=>{
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity
    });
    gui.addColor(controls, 'ambientColor').onChange((e)=>{
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
    });
    gui.add(controls,"disableSpotlight").onChange((e)=>{
        spotLight.visible = !e;
    })


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

