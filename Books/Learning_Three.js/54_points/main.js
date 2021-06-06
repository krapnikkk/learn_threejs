function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();
    var scene = new THREE.Scene();

    var clock = new THREE.Clock();
    var trackballControls = initTrackballControls(camera, renderer);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    createPoints();
    render();

    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createPoints() {
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            color: 0xffffff
        })
        for (var x = -15; x < 15; x++) {
            for (var y = -10; y < 10; y++) {
                var particle = new THREE.Vector3(x * 4, y * 4, 0);
                geom.vertices.push(particle);
                geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
            }
        }
        var cloud = new THREE.Points(geom, material);
        scene.add(cloud);
    }

}