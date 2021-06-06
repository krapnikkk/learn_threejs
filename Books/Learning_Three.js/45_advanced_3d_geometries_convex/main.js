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

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return generatePoints();
            });
        };
    }

    gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
    }).onChange(controls.redraw)
    gui.add(controls, 'redraw');
    gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
    gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

    controls.redraw();
    var step = 0, spGroup;

    function generatePoints() {
        if (spGroup) {
            spGroup.traverse((obj) => {
                if (obj.type === 'Mesh') {
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
            })
            scene.remove(spGroup)
        }
        var points = [];
        for (let i = 0; i < 20; i++) {
            var randomX = -15 + Math.round(Math.random() * 30),
                randomY = -15 + Math.round(Math.random() * 30),
                randomZ = -15 + Math.round(Math.random() * 30);
            points.push(new THREE.Vector3(randomX, randomY, randomZ));
        }

        spGroup = new THREE.Object3D();
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: false
        })

        points.forEach((point) => {
            var spGeom = new THREE.SphereGeometry(0.2);
            var spMesh = new THREE.Mesh(spGeom, material);
            spMesh.position.copy(point);
            spGroup.add(spMesh);
        })
        scene.add(spGroup);

        var convexGeometry = new THREE.ConvexGeometry(points);
        convexGeometry.computeVertexNormals();
        convexGeometry.computeFaceNormals();
        convexGeometry.normalsNeedUpdate = true;
        return convexGeometry;
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