function init() {
    window.addEventListener('resize', onResize, false);

    var stats = initStats();
    var renderer = initRenderer();

    var scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
    camera.position.set(-50, 40, 50);
    camera.lookAt(scene.position);

    var controls = {
        cameraNear: camera.near,
        cameraFar: camera.far,
        rotationSpeed: 0.02,
        numberOfObjects: scene.children.length,

        removeCube: function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                controls.numberOfObjects = scene.children.length;
            }
        },

        addCube: function () {

            var cubeSize = Math.ceil(3 + (Math.random() * 3));
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            scene.add(cube);
            controls.numberOfObjects = scene.children.length;
        },

        outputObjects: function () {
            console.log(scene.children);
        }
    };

    var gui = new dat.GUI();
    addBasicMaterialSettings(gui, controls, scene.overrideMaterial);
    var spGui = gui.addFolder("THREE.MeshDepthMaterial");
    spGui.add(scene.overrideMaterial, 'wireframe');
    spGui.add(scene.overrideMaterial, 'wireframeLinewidth', 0.1, 20);

    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'cameraNear', 0, 100).onChange(function (e) {
        camera.near = e;
        camera.updateProjectionMatrix();
    });
    gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
        camera.far = e;
        camera.updateProjectionMatrix();
    });

    var i = 0;
    while (i < 10) {
        controls.addCube();
        i++;
    }


    render();

    function render() {
        stats.update();

        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;//长宽比
        camera.updateProjectionMatrix();//更新摄像机的矩阵
        renderer.setSize(window.innerWidth, innerHeight);
    }
}

