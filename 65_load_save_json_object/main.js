function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(0, 40, 50));
    camera.lookAt(scene.position);

    var knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3));
    scene.add(knot);

    var step = 0, loadedMesh;

    var controls = {
        radius: knot.geometry.parameters.radius,
        radialSegments: knot.geometry.parameters.radialSegments,
        tubularSegments: knot.geometry.parameters.tubularSegments,
        tube: 0.3,
        p: knot.geometry.parameters.p,
        q: knot.geometry.parameters.q,

        redraw: () => {
            knot.material.dispose();
            knot.geometry.dispose();
            scene.remove(knot);
            knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q)));
            scene.add(knot);

        },
        save: () => {
            var res = knot.toJSON();
            localStorage.setItem("json", JSON.stringify(res));
            console.log(localStorage.getItem("json"));
        },
        load: () => {
            if (loadedMesh) {
                loadedMesh.material.dispose();
                loadedMesh.geometry.dispose();
                scene.remove(loadedMesh);
            }
            var json = localStorage.getItem("json");

            if (json) {
                var loadedGeometry = JSON.parse(json);
                var loader = new THREE.ObjectLoader();

                loadedMesh = loader.parse(loadedGeometry);
                loadedMesh.position.x -= 40;
                scene.add(loadedMesh);
            }
        }
    }

    var gui = new dat.GUI();
    var ioGui = gui.addFolder('Save & Load');
    ioGui.add(controls, 'save').onChange(controls.save);
    ioGui.add(controls, 'load').onChange(controls.load);
    var meshGui = gui.addFolder('mesh');
    meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
    meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
    meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);

    render();

    function createMesh(geom) {
        var meshMaterial = new THREE.MeshBasicMaterial({
            vertexColors: THREE.vertexColors,
            wireframe: true,
            wireframeLineWidth: 2,
            color: 0xaaaaaa
        });
        meshMaterial.side = THREE.DoubleSize;

        var mesh = new THREE.Mesh(geom, meshMaterial);
        mesh.position.set(20, 0, 0);
        return mesh;
    }

    function render() {
        stats.update();

        knot.rotation.y = step += 0.01;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}