function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();
    var scene = new THREE.Scene();

    var clock = new THREE.Clock();
    var trackballControls = initTrackballControls(camera, renderer);

    camera.position.set(20, 0, 150);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var controls = {
        size: 4,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        color: 0xffffff,
        vertexColor: 0x00ff00,
        sizeAttenuation: true,
        rotate: true,

        redraw: () => {
            var particles = scene.getObjectByName("particles")
            if (particles) {
                particles.geometry.dispose();
                particles.material.dispose();
                scene.remove(particles);
            }

            createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
                controls.sizeAttenuation, controls.color, controls.vertexColor)
        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.add(controls, 'vertexColors').onChange(controls.redraw);

    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
    gui.add(controls, 'rotate').onChange();

    controls.redraw();
    render();

    var step = 0, cloud;
    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());
        if (controls.rotate) {
            step += 0.01;
            cloud.rotation.x = step;
            cloud.rotation.z = step;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color, vertexColor) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: size,
            vertexColors: vertexColors,
            color: new THREE.Color(color),
            opacity: opacity,
            sizeAttenuation: sizeAttenuation,
            transparent: transparent
        })

        var range = 500;
        for (var i = 0; i < 15000; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);
            var color = new THREE.Color(vertexColor),
                asHSL = {};
            color.getHSL(asHSL);
            color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
            geom.colors.push(color);
        }
        cloud = new THREE.Points(geom, material);
        cloud.name = "particles";
        scene.add(cloud);
    }

}