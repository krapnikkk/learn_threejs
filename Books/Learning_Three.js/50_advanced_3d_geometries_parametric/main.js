function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var groundPlane = addLargeGroundPlane(scene);
    groundPlane.position.y = -30;
    initDefaultLighting(scene);

    function klein(u, v, optionalTarget) {
        var result = optionalTarget || new THREE.Vector3();

        u *= Math.PI;
        v *= 2 * Math.PI;

        u = u * 2;
        var x, y, z;
        if (u < Math.PI) {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
            z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
        }

        y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

        return result.set(x, y, z);
    };

    function radialWave(u, v, optionalTarget) {

        var result = optionalTarget || new THREE.Vector3();
        var r = 50;

        var x = Math.sin(u) * r;
        var z = Math.sin(v / 2) * 2 * r;
        var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

        return result.set(x, y, z);
    };

    var gui = new dat.GUI();
    var controls = new function () {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.slices = 50;
        this.stacks = 50;
        this.renderFunction = 'radialWave';

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                var geom;
                switch (this.renderFunction) {
                    case "radialWave":
                        geom = new THREE.ParametricGeometry(radialWave, this.slices, this.stacks);
                        geom.center();
                        break;
                    case "klein":
                        geom = new THREE.ParametricGeometry(klein, this.slices, this.stacks);
                        geom.center();
                        break;
                }
                return geom;
            });
        };
    }
    gui.add(controls, 'renderFunction', ["radialWave", "klein"]).onChange(controls.redraw);
    gui.add(controls, 'slices', 10, 120, 1).onChange(controls.redraw);
    gui.add(controls, 'stacks', 10, 120, 1).onChange(controls.redraw);

    gui.add(controls, 'appliedMaterial', {
        meshNormal: applyMeshNormalMaterial,
        meshStandard: applyMeshStandardMaterial
    }).onChange(controls.redraw)
    gui.add(controls, 'redraw');
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