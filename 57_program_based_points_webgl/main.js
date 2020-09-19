function init() {

    var stats = initStats();
    var camera = initCamera(new THREE.Vector3(20, 0, 150));
    var renderer = initRenderer();
    var scene = new THREE.Scene();

    // var clock = new THREE.Clock();
    // var trackballControls = initTrackballControls(camera, renderer);

    var controls = {
        size: 15,
        transparent: true,
        opacity: 0.6,
        color: 0xffffff,
        rotate: true,
        sizeAttenuation: true,
        redraw: () => {
            var points = scene.getObjectByName('points');
            if (points) {
                points.geometry.dispose();
                points.material.dispose();
                scene.remove(points);
                points = null;
            }
            createPoints(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
    gui.add(controls, 'rotate');

    controls.redraw();
    render();

    var cloud, step = 0;
    function render() {
        stats.update();
        // trackballControls.update(clock.getDelta());

        if (controls.rotate) {
            step += 0.01;
            cloud.rotation.x = step;
            cloud.rotation.z = step;
        }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    function createPoints(size, transparent, opacity, sizeAttenuation, color) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: createGhostTexture(),
            sizeAttenuation: sizeAttenuation,
            color: color
        })

        var range = 500;
        for (var i = 0; i < 5000; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);
        }
        cloud = new THREE.Points(geom, material);
        cloud.name = 'points';
        scene.add(cloud);
    }

}