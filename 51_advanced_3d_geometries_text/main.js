function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var groundPlane = addLargeGroundPlane(scene);
    groundPlane.position.y = -30;
    initDefaultLighting(scene);

    var font_bitstream, font_helvetiker_bold, font_helvetiker_regular;
    var fontload1 = new THREE.FontLoader();
    fontload1.load('../assets/fonts/bitstream_vera_sans_mono_roman.typeface.json', function (response) {
        controls.font = response;
        font_bitstream = response;
        controls.redraw();
        render();
    });

    var fontload2 = new THREE.FontLoader();
    fontload2.load('../assets/fonts/helvetiker_bold.typeface.json', function (response) {
        font_helvetiker_bold = response;
    });

    var fontload3 = new THREE.FontLoader();
    fontload3.load('../assets/fonts/helvetiker_regular.typeface.json', function (response) {
        font_helvetiker_regular = response;
    });


    var gui = new dat.GUI();
    var controls = new function () {
        this.appliedMaterial = applyMeshNormalMaterial
        this.castShadow = true;
        this.groundPlaneVisible = true;

        this.size = 90;//文本大小
        this.height = 90;//拉伸的长度
        this.bevelThickness = 2;//斜角的深度
        this.bevelSize = 0.5;//斜角的高度
        this.bevelSegments = 3;//斜角的段数
        this.bevelEnabled = true;//斜角开关
        this.curveSegments = 12;//拉伸曲线的段数
        this.steps = 1;//拉伸体的段数
        this.font = null;//字体数据
        this.fontName = "bitstream vera sans mono";

        this.redraw = () => {
            switch (controls.fontName) {
                case 'bitstream vera sans mono':
                    controls.font = font_bitstream
                    break;
                case 'helvetiker':
                    controls.font = font_helvetiker_regular
                    break;
                case 'helvetiker bold':
                    controls.font = font_helvetiker_bold
                    break;
            }
            redrawGeometryAndUpdateUI(gui, scene, controls, () => {
                var options = {
                    size: controls.size,
                    height: controls.height,
                    weight: controls.weight,
                    font: controls.font,
                    bevelThickness: controls.bevelThickness,
                    bevelSize: controls.bevelSize,
                    bevelSegments: controls.bevelSegments,
                    bevelEnabled: controls.bevelEnabled,
                    curveSegments: controls.curveSegments,
                    steps: controls.steps
                };

                var geom = new THREE.TextGeometry("Hello world!", options)
                geom.applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
                geom.center();

                return geom
            });
        };
    }
    gui.add(controls, 'size', 0, 200).onChange(controls.redraw);
    gui.add(controls, 'height', 0, 200).onChange(controls.redraw);
    gui.add(controls, 'fontName', ['bitstream vera sans mono', 'helvetiker', 'helvetiker bold']).onChange(controls.redraw);
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
    gui.add(controls, 'redraw');
    gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
    gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })


    var step = 0;

    function render() {
        stats.update();
        controls.mesh.rotation.y = step += 0.01;
        controls.mesh.rotation.x = step;
        controls.mesh.rotation.z = step;

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}