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

        this.baseGeom = new THREE.ConeGeometry(20, 20, 8, 8, false, 0, 2 * Math.PI);
        this.radius = this.baseGeom.parameters.radius;//圆锥体的底部半径
        this.height = this.baseGeom.parameters.height;//圆锥体的高
        this.radialSegments = this.baseGeom.parameters.radialSegments;//圆锥体的半径分成多少段
        this.heightSegments = this.baseGeom.parameters.heightSegments;//圆锥体的高度分成多少段
        this.openEnded = this.baseGeom.parameters.openEnded;//指定网格的顶部和底部是否封闭
        this.thetaStart = this.baseGeom.parameters.thetaStart;//从x轴的弧度开始绘制球体
        this.thetaLength = this.baseGeom.parameters.thetaLength;//从thetaStart的弧度开始画到弧度绘制球体

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return new THREE.ConeGeometry(
                    this.radius,this.height,this.radialSegments, this.heightSegments,this.openEnded, this.thetaStart, this.thetaLength
                );
            });
        };
    }

    gui.add(controls, 'radius', -40, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'height', 0, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'radialSegments', 3, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'heightSegments', 2, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'openEnded').onChange(controls.redraw);
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