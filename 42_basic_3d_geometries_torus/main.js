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

        this.radius = 10;//圆环体的完整圆环半径
        this.tube = 10;//圆环体的管圆环的半径
        this.radialSegments = 8;//圆环体的半径分成多少段
        this.tubularSegments = 6;//圆环体的宽度分成多少段
        this.arc = 2*Math.PI;//设置圆环体的弧度
        
        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return new THREE.TorusGeometry(
                    this.radius,this.tube,this.radialSegments, this.tubularSegments,this.arc
                );
            });
        };
    }

    gui.add(controls, 'radius', -40, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'tube', 0, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'radialSegments', 3, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'tubularSegments', 2, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'arc', 0, 2 * Math.PI).onChange(controls.redraw);
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