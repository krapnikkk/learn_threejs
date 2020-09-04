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


    document.querySelector("#webgl-output").appendChild(renderer.domElement);
    // renderer.render(scene, camera);

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();


    var step = 0;

    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    //顶点坐标
    var vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];

    var faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();

    var materials = [
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
        new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true })
    ]

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    mesh.castShadow = true;
    mesh.children.forEach((e) => {
        e.castShadow = true;
    });
    scene.add(mesh);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;//开启阴影功能
    spotLight.lookAt(mesh);
    scene.add(spotLight);

    function addControl(x, y, z) {
        return {
            x: x,
            y: y,
            z: z
        }
    }
    var controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));

    var gui = new dat.GUI();
    gui.add({
        clone : function(){
            var clonedGeometry = mesh.children[0].geometry.clone();
            var materials = [
                new THREE.MeshLambertMaterial({ opacity: 0.8, color: 0xff44ff, transparent: true }),
                new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
            ];

            var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
            mesh2.children.forEach((e) => {
                e.castShadow = true
            });

            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = "clone";
            scene.remove(scene.getChildByName("clone"));
            scene.add(mesh2);
        }
    }, "clone");

    for (var i = 0; i < 8; i++) {

        f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);
  
    }

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

