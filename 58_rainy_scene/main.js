function init() {

    var stats = initStats();
    var camera = initCamera(new THREE.Vector3(20, 40, 110));
    var renderer = initRenderer();
    var scene = new THREE.Scene();

    camera.lookAt(new THREE.Vector3(20, 30, 0));

    var clock = new THREE.Clock();
    var trackballControls = initTrackballControls(camera, renderer);

    var controls = {
        size: 3,
        transparent: true,
        opacity: 0.6,
        color: 0xffffff,
        sizeAttenuation: true,
        redraw: () => {
            var points = scene.getObjectByName('points');
            if (points) {
                points.geometry.dispose();
                points.material.dispose();
                scene.remove(points);
                points = null;
            }
            createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

    controls.redraw();
    render();

    var cloud, step = 0;
    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        var vertices = cloud.geometry.vertices;
        vertices.forEach((v) => {
            v.y = v.y - v.velocityY;
            v.x = v.x - v.velocityX;
            if (v.y <= 0) v.y = 60;
            if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
        })
        cloud.geometry.verticesNeedUpdate = true;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    function createPointCloud(size, transparent, opacity, sizeAttenuation, color) {
        var texture = new THREE.TextureLoader().load("../assets/textures/particles/raindrop-3.png");
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: texture,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: sizeAttenuation,
            color: color
        })

        var range = 40;
        for (var i = 0; i < 1500; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range * 1.5, 1 + (i / 100));
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            geom.vertices.push(particle);
        }
        cloud = new THREE.Points(geom, material);
        cloud.sortParticles = true;
        cloud.name = 'points';
        scene.add(cloud);
    }

}