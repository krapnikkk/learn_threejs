function init() {

    var stats = initStats();
    var camera = initCamera(new THREE.Vector3(20, 40, 110));
    var renderer = initRenderer();
    var scene = new THREE.Scene();

    camera.lookAt(new THREE.Vector3(20, 30, 0));

    var clock = new THREE.Clock();
    var trackballControls = initTrackballControls(camera, renderer);

    var controls = {
        size: 10,
        transparent: true,
        opacity: 0.6,
        color: 0xffffff,
        sizeAttenuation: true,
        redraw: () => {
            var toRemove = [];
            scene.children.forEach((child) => {
                if (child instanceof THREE.Points) {
                    toRemove.push(child);
                }
            });
            toRemove.forEach((child) => {
                child.geometry.dispose();
                child.material.dispose();
                scene.remove(child);
            })
            createPointInstances(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
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

    var cloud;
    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        scene.children.forEach((child) => {
            if (child instanceof THREE.Points) {
                var vertices = child.geometry.vertices;
                vertices.forEach((v) => {
                    v.y = v.y - v.velocityY;
                    v.x = v.x - v.velocityX;
                    v.z = v.z - v.velocityZ;
                    if (v.y <= 0) v.y = 60;
                    if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                    if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
                })
                child.geometry.verticesNeedUpdate = true;
            }
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color) {
        var color = new THREE.Color(color);
        color.setHSL(color.getHSL().h, color.getHSL().s, color.getHSL().l * Math.random());
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: texture,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: sizeAttenuation,
            depthWrite: false,
            color: color
        })

        var range = 40;
        for (var i = 0; i < 150; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range * 1.5, Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityZ = (Math.random() - 0.5) / 3;
            geom.vertices.push(particle);
        }
        cloud = new THREE.Points(geom, material);
        cloud.name = name;
        return cloud;
    }

    function createPointInstances(size, transparent, opacity, sizeAttenuation, color) {
        var loader = new THREE.TextureLoader();
        var texture1 = loader.load('../assets/textures/particles/snowflake1_t.png');
        var texture2 = loader.load('../assets/textures/particles/snowflake2_t.png');
        var texture3 = loader.load('../assets/textures/particles/snowflake3_t.png');
        var texture4 = loader.load('../assets/textures/particles/snowflake5_t.png');

        scene.add(createPointCloud("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPointCloud("system4", texture4, size, transparent, opacity, sizeAttenuation, color));
    }

}