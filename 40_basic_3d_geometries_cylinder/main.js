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

        this.baseGeom = new THREE.CylinderGeometry(20, 20, 20, 8, 8, false, 0, 2 * Math.PI);
        this.radiusTop = this.baseGeom.parameters.radiusTop;//圆柱体的顶部尺寸
        this.radiusBottom = this.baseGeom.parameters.radiusBottom;//圆柱体的底部尺寸
        this.height = this.baseGeom.parameters.height;//圆柱体的高
        this.radialSegments = this.baseGeom.parameters.radialSegments;//圆柱体的半径分成多少段
        this.heightSegments = this.baseGeom.parameters.heightSegments;//圆柱体的高度分成多少段
        this.openEnded = this.baseGeom.parameters.openEnded;//指定网格的顶部和底部是否封闭
        this.thetaStart = this.baseGeom.parameters.thetaStart;//从x轴的弧度开始绘制球体
        this.thetaLength = this.baseGeom.parameters.thetaLength;//从thetaStart的弧度开始画到弧度绘制球体

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                return new THREE.CylinderGeometry(
                    this.radiusTop, this.radiusBottom, this.height,
                    this.radialSegments, this.heightSegments,this.openEnded, this.thetaStart, this.thetaLength
                );
            });
        };
    }

    gui.add(controls, 'radiusTop', -40, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'radiusBottom', -40, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'height', 0, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'radialSegments', 3, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'heightSegments', 2, 40).step(1).onChange(controls.redraw);
    gui.add(controls, 'openEnded').onChange(controls.redraw);
    gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
    gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw); gui.add(controls, 'appliedMaterial', {
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

    function drawShape() {
        var shape = new THREE.Shape();
        shape.moveTo(10, 10);//绘图点移动到指定位置
        shape.lineTo(10, 40);//从绘图点绘制一条线到指定坐标
        shape.bezierCurveTo(15, 25, 25, 25, 30, 40);//使用贝塞尔绘制曲线
        shape.splineThru(//使用提供的坐标集合绘制一条光滑的曲线
            [new THREE.Vector2(32, 30),
            new THREE.Vector2(28, 20),
            new THREE.Vector2(30, 10),
            ]);
        shape.quadraticCurveTo(20, 15, 10, 10);
        var hole1 = new THREE.Path();
        hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole1);

        var hole2 = new THREE.Path();
        hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole2);

        var hole3 = new THREE.Path();
        hole3.absarc(20, 16, 2, 0, Math.PI, true);//使用绝对位置绘制圆弧
        shape.holes.push(hole3);

        return shape;
    }
}