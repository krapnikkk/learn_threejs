function init() {
    // use the defaults
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();

    var scene = new THREE.Scene();

    var cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
    var meshMaterial1 = createMaterial('vertex-shader', 'fragment-shader-1'),
        meshMaterial2 = createMaterial('vertex-shader', 'fragment-shader-2'),
        meshMaterial3 = createMaterial('vertex-shader', 'fragment-shader-3'),
        meshMaterial4 = createMaterial('vertex-shader', 'fragment-shader-4'),
        meshMaterial5 = createMaterial('vertex-shader', 'fragment-shader-5'),
        meshMaterial6 = createMaterial('vertex-shader', 'fragment-shader-6');
    var material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
    var cube = new THREE.Mesh(cubeGeometry, material);
    scene.add(cube);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    render();
    var step = 0;
    function render() {
        cube.rotation.y = step += 0.01;
        cube.rotation.x = step;
        cube.rotation.z = step;

        cube.material.forEach(function (e) {
            e.uniforms.time.value += 0.01;
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}