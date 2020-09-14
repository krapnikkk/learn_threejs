function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var stats = initStats();

    var groundPlane = addLargeGroundPlane(scene);
    groundPlane.position.y = -10;
    initDefaultLighting(scene);

    var gui = new dat.GUI();
    var controls = new function () {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.innerRadius = 3;//内半径
        this.outerRadius = 10;//外半径
        this.thetasegments = 10;//创建圆环的长度的对角线线段的数量
        this.phiSegments = 8;//沿着圆环的长度所需要使用的线段的数量
        this.thetaStart = 0;//圆的起始弧
        this.thetaLength = Math.PI * 2;//圆的结束弧
        

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return new THREE.RingGeometry();
            });
        };
    }

    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'segments', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
    gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);
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