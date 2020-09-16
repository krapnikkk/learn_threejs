function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var groundPlane = addLargeGroundPlane(scene);
    groundPlane.position.y = -30;
    initDefaultLighting(scene);

    var gui = new dat.GUI();
    var controls = new function () {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.segments = 12;
        this.phiStart = 0;
        this.phiLength = 2 * Math.PI;

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return generatePoints(this.segments, this.phiStart, this.phiLength);
            });
        };
    }

    gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
    gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
    gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

    gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
    }).onChange(controls.redraw)
    gui.add(controls, 'redraw');
    gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
    gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

    controls.redraw();
    var step = 0, spGroup;

    function generatePoints(segments, phiStart, phiLength) {
        if (spGroup) {
            spGroup.traverse((obj) => {
                if (obj.type === 'Mesh') {
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
            })
            scene.remove(spGroup)
        }
        var points = [], height = 5, count = 30;
        for (let i = 0; i < count; i++) {
            points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) + count / 2));
        }

        spGroup = new THREE.Object3D();
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: false
        })

        points.forEach((point) => {
            var spGeom = new THREE.SphereGeometry(0.2);
            var spMesh = new THREE.Mesh(spGeom, material);
            spMesh.position.set(point.x, point.y,0);
            spGroup.add(spMesh);
        })
        scene.add(spGroup);

        var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
        return latheGeometry;
    }

    function render() {
        stats.update();
        controls.mesh.rotation.y = step += 0.01;
        controls.mesh.rotation.x = step;
        controls.mesh.rotation.z = step;

        if (spGroup) {
            spGroup.rotation.x = step;
            spGroup.rotation.y = step;
            spGroup.rotation.z = step;

        }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}