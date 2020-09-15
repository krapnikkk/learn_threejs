function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var stats = initStats();

    var groundPlane = addLargeGroundPlane(scene);
    groundPlane.position.y = -30;
    initDefaultLighting(scene);

    var gui = new dat.GUI();
    var controls = new function () {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.radius = 10;//多面体的大小
        this.details = 0;//多面体的细节程度
        this.type = 'Icosahedron';

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                var polyhedron;
                switch (this.type) {
                    case 'Icosahedron'://二十面体
                        polyhedron = new THREE.IcosahedronGeometry(this.radius, this.details);
                        break;
                    case 'Tetrahedron'://四面体
                        polyhedron = new THREE.TetrahedronGeometry(this.radius, this.details);
                        break;
                    case 'Octahedron'://八面体
                        polyhedron = new THREE.OctahedronGeometry(this.radius, this.details);
                        break;
                    case 'Dodecahedron'://十二面体
                        polyhedron = new THREE.DodecahedronGeometry(this.radius, this.details);
                        break;
                    case 'Custom':
                        var vertices = [
                            1, 1, 1,
                            -1, -1, 1,
                            -1, 1, -1,
                            1, -1, 1];
                        var indices = [
                            2, 1, 0,
                            0, 3, 2,
                            1, 3, 0,
                            2, 3, 1
                        ];
                        polyhedron = new THREE.PolyhedronGeometry(vertices, indices, this.radius, this.details);
                        break;
                }
                return polyhedron;
            });
        };
    }

    gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'details', 0, 3).step(1).onChange(controls.redraw);
    gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);
    gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
    }).onChange(controls.redraw)

    gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
    gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

    controls.redraw();
    var step = 0;
    function render() {
        stats.update();
        controls.mesh.rotation.y = step += 0.01;
        controls.mesh.rotation.x = step;
        controls.mesh.rotation.z = step;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}