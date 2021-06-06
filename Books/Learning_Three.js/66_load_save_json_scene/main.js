function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(20, 40, 110));
    camera.lookAt(new THREE.Vector3(20, 30, 0));
    

    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 0, 2);
    scene.add(sphere);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    var spotLight = new THREE.PointLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);

    var controls = {
        exportScene: () => {
            localStorage.setItem('scene', JSON.stringify(scene.toJSON()));
            console.log(localStorage.getItem('scene'));
        },
        clearScene: () => {
            scene = new THREE.Scene();
        },
        importScene: () => {
            var json = localStorage.getItem('scene');
            if (json) {
                var loadSceneAsJson = JSON.parse(json);
                var loader = new THREE.ObjectLoader();
                scene = loader.parse(loadSceneAsJson);
            }
        }
    }

    var gui = new dat.GUI();
    gui.add(controls, "exportScene");
    gui.add(controls, "clearScene");
    gui.add(controls, "importScene");

    render();

    function render() {
        stats.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}