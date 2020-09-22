function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(-30, 40, 50));

    var knot;
    var controls = {
        radius: 13,
        tube: 1.7,
        radialSegments: 156,
        tubularSegments: 12,
        p: 5,
        q: 4,
        asParticles: false,
        rotate: false,
        redraw: () => {
            if (knot) {
                knot.geometry.dispose();
                knot.material.dispose();
                scene.remove(knot);
            }
            var geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q));
            if (controls.asParticles) {
                knot = createPoints(geom);
            } else {
                knot = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
            }
            scene.add(knot)

        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
    gui.add(controls, 'asParticles').onChange(controls.redraw);
    gui.add(controls, 'rotate').onChange();

    controls.redraw();
    render();

    function generateSprite() {
        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var ctx = canvas.getContext('2d');
        var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createPoints(geom) {
        var material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: generateSprite(),
            depthWrite: false
        });
        var cloud = new THREE.Points(geom, material);
        return cloud;
    }

    function render() {
        stats.update();
        if (controls.rotate) {
            knot.rotation.y += 0.01;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}