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

        this.baseGeom = new THREE.SphereGeometry(4, 10, 10);
        this.radius = this.baseGeom.parameters.radius;//球体半径
        this.widthSegments = this.baseGeom.parameters.widthSegments;//球体竖直方向上的分段数
        this.heightSegments = this.baseGeom.parameters.heightSegments;//球体水平方向上的分段数
        this.phiStart = 0;//从x轴的弧度开始绘制球体
        this.phiLength = Math.PI * 2;//从phiStart的弧度开始画到的弧度绘制球体
        this.thetaStart = 0;//从y轴的弧度开始绘制球体
        this.thetaLength = Math.PI;//从thetaStart的弧度开始画到弧度绘制球体

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return new THREE.SphereGeometry(
                    this.radius, this.widthSegments, this.heightSegments,
                    this.phiStart, this.phiLength, this.thetaStart, this.thetaLength
                );
            });
        };
    }

    gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'widthSegments', 3, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'heightSegments', 2, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
    gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
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