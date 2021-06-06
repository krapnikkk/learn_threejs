function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(30, 30, 30));
    initDefaultLighting(scene);
    addLargeGroundPlane(scene);

    var step = 0.03, sphere, cube, group, bboxMesh, arrow;
    var controls = {
        cubePosX: 0,
        cubePosY: 3,
        cubePosZ: 10,

        spherePosX: 10,
        spherePosY: 5,
        spherePosZ: 0,

        groupPosX: 10,
        groupPosY: 5,
        groupPosZ: 0,

        grouping: false,
        rotate: false,
        groupScale: 1,
        cubeScale: 1,
        sphereScale: 1,
        redraw: () => {
            if (group) {
                scene.remove(group);
            }
            sphere = createMesh(new THREE.SphereGeometry(5, 10, 10));
            cube = createMesh(new THREE.BoxGeometry(6, 6, 6));

            sphere.position.set(controls.spherePosX, controls.spherePosY, controls.spherePosZ);
            sphere.scale.set(controls.sphereScale, controls.sphereScale, controls.sphereScale);
            cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
            cube.scale.set(controls.cubeScale, controls.cubeScale, controls.cubeScale);

            group = new THREE.Group();
            group.position.set(controls.groupPosX, controls.groupPosY, controls.groupPosZ);
            group.scale.set(controls.groupScale, controls.groupScale, controls.groupScale);

            group.add(cube);
            group.add(sphere);
            scene.add(group);
            controls.positionBoundingBox();

            if (arrow) {
                scene.remove(arrow);
            }
            arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff);
            scene.add(arrow);

        },
        positionBoundingBox: () => {
            scene.remove(bboxMesh);
            var box = setFromObject(group);
            var width = box.max.x - box.min.x;
            var height = box.max.y - box.min.y;
            var depth = box.max.z - box.min.z;

            var bbox = new THREE.BoxGeometry(width, height, depth);
            bboxMesh = new THREE.Mesh(bbox, new THREE.MeshBasicMaterial({
                color: 0x000000,
                vertexColors: THREE.VertexColors,
                wireframeLinewidth: 2,
                wireframe: true
            }));

            bboxMesh.position.set = ((box.min.x + box.max.x) / 2, (box.min.x + box.max.x) / 2, (box.min.x + box.max.x) / 2);
        }
    }

    var gui = new dat.GUI();
    var sphereFolder = gui.addFolder("sphere");
    sphereFolder.add(controls, "spherePosX", -20, 20).onChange(function (e) {
        sphere.position.x = e;
        controls.positionBoundingBox()
        controls.redraw();
    });
    sphereFolder.add(controls, "spherePosZ", -20, 20).onChange(function (e) {
        sphere.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    sphereFolder.add(controls, "spherePosY", -20, 20).onChange(function (e) {
        sphere.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    sphereFolder.add(controls, "sphereScale", 0, 3).onChange(function (e) {
        sphere.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
    });

    var cubeFolder = gui.addFolder("cube");
    cubeFolder.add(controls, "cubePosX", -20, 20).onChange(function (e) {
        cube.position.x = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "cubePosZ", -20, 20).onChange(function (e) {
        cube.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "cubePosY", -20, 20).onChange(function (e) {
        cube.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "cubeScale", 0, 3).onChange(function (e) {
        cube.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
    });

    var cubeFolder = gui.addFolder("group");
    cubeFolder.add(controls, "groupPosX", -20, 20).onChange(function (e) {
        group.position.x = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "groupPosZ", -20, 20).onChange(function (e) {
        group.position.z = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "groupPosY", -20, 20).onChange(function (e) {
        group.position.y = e;
        controls.positionBoundingBox();
        controls.redraw();
    });
    cubeFolder.add(controls, "groupScale", 0, 3).onChange(function (e) {
        group.scale.set(e, e, e);
        controls.positionBoundingBox();
        controls.redraw();
    });

    gui.add(controls, "grouping");
    gui.add(controls, "rotate");

    controls.redraw();
    render();

    function createMesh(geom) {
        var meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;

        var plane = new THREE.Mesh(geom, meshMaterial);

        return plane;
    }

    function render() {
        stats.update();
        if (controls.grouping && controls.rotate) {
            group.rotation.y += step;
        }

        if (controls.rotate && !controls.grouping) {
            sphere.rotation.y += step;
            cube.rotation.y += step;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function setFromObject(object) {
        var box = new THREE.Box3();
        var v1 = new THREE.Vector3();
        object.updateMatrixWorld(true);
        box.makeEmpty();
        object.traverse(function (node) {
            if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
                var vertices = node.geometry.vertices;
                for (var i = 0, il = vertices.length; i < il; i++) {
                    v1.copy(vertices[i]);
                    v1.applyMatrix4(node.matrixWorld);
                    box.expandByPoint(v1);
                }
            }
        });
        return box;
    }

}