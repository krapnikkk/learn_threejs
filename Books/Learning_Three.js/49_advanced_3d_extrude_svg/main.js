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

        this.amount = 2;//图形的深度设置
        this.bevelThickness = 2;//指定斜角的深度
        this.bevelSize = 0.5;//指定斜角的高度
        this.bevelSegments = 3;//斜角的分段数
        this.bevelEnabled = true;//是否有斜角
        this.curveSegments = 12;//拉伸图形时曲线分成的段数
        this.steps = 1;

        this.redraw = () => {
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                var options = {
                    amount: this.amount,
                    bevelThickness: this.bevelThickness,
                    bevelSize: this.bevelSize,
                    bevelSegments: this.bevelSegments,
                    bevelEnabled: this.bevelEnabled,
                    curveSegments: this.curveSegments,
                    steps: this.steps
                };
                var geom = new THREE.ExtrudeGeometry(drawShape(), options);
                geom.applyMatrix(new THREE.Matrix4().makeScale(0.04, 0.04, 0.04));
                geom.center();
                return geom;
            });
        };
    }

    gui.add(controls, 'amount', 0, 20).onChange(controls.redraw);
    gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
    gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
    gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
    gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);

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

    function drawShape() {
        var svgString = document.querySelector("#batman-path").getAttribute("d");
        var shape = transformSVGPathExposed(svgString);

        return shape;
    }
}