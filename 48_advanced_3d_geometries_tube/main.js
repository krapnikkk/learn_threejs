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

        this.numberOfPoints = 5;
        this.segments = 64;//管的分段数
        this.radius = 1;//管的半径
        this.radiusSegments = 8;//管道周围的分段数
        this.closed = false;//是否首尾闭合
        this.points = [];

        this.newPoints = () => {
            var points = [];
            for (var i = 0; i < this.numberOfPoints; i++) {
                var randomX = -20 + Math.round(Math.random() * 50),
                    randomY = -15 + Math.round(Math.random() * 40),
                    randomZ = -20 + Math.round(Math.random() * 40);
                points.push(new THREE.Vector3(randomX, randomY, randomZ));
            }
            this.points = points;
            
            this.redraw();
        }

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return generatePoints(this.points, this.segments,
                    this.radius, this.radiusSegments, this.closed);
            });
        };
    }

    gui.add(controls, 'newPoints');
    gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);
    gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
    gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);
    gui.add(controls, 'closed').onChange(controls.redraw);

    gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
    }).onChange(controls.redraw)
    gui.add(controls, 'redraw');
    gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
    gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

    controls.newPoints();
    var step = 0, spGroup;

    function generatePoints(points, segments, radius, radiusSegments, closed) {
        if (spGroup) {
            spGroup.traverse((obj) => {
                if (obj.type === 'Mesh') {
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
            })
            scene.remove(spGroup)
        }

        spGroup = new THREE.Object3D();
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: false
        })

        points.forEach((point) => {
            var spGeom = new THREE.SphereGeometry(0.2);
            var spMesh = new THREE.Mesh(spGeom, material);
            spMesh.position.copy(point)
            spGroup.add(spMesh);
        })
        scene.add(spGroup);

        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed);
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