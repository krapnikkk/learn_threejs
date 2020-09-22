function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(0, 40, 50));
    camera.lookAt(scene.position);

    var cubeMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.5
    });

    var controls = {
        combined: false,
        numberOfObjects: 500,

        redraw: () => {
            var toRemove = [];
            scene.traverse((e) => {
                if (e instanceof THREE.Mesh) {
                    toRemove.push(e);
                }
            });
            toRemove.forEach((e) => {
                e.geometry.dispose();
                e.material.dispose();
                scene.remove(e);
            });

            if (controls.combined) {
                var geometry = new THREE.Geometry();
                for (var i = 0; i < controls.numberOfObjects; i++) {
                    var cubeMesh = addCube();
                    cubeMesh.updateMatrix();
                    geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
                }
                scene.add(new THREE.Mesh(geometry, cubeMaterial));
            } else {
                for (var i = 0; i < controls.numberOfObjects; i++) {
                    scene.add(addCube());
                }
            }

        }
    }

    var gui = new dat.GUI();
    gui.add(controls, 'numberOfObjects', 0, 20000);
    gui.add(controls, 'combined').onChange(controls.redraw);
    gui.add(controls, 'redraw');

    controls.redraw();
    render();

    var rotation = 0;

    function addCube() {
        var cubeSize = 1.0;
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        cube.position.x = -60 + Math.round((Math.random() * 100));
        cube.position.y = Math.round((Math.random() * 10));
        cube.position.z = -150 + Math.round((Math.random() * 175));

        return cube;
    }

    function render() {
        stats.update();
        
        rotation += 0.005;
        //移动镜头
        camera.position.x = Math.sin(rotation) * 50;
        camera.position.z = Math.cos(rotation) * 50;
        camera.lookAt(scene.position);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}