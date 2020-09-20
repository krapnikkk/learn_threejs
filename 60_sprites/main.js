function init() {

    var stats = initStats();
    var camera = initCamera(new THREE.Vector3(0, 0, 50));
    var cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, -10);

    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var sceneOrtho = new THREE.Scene();

    var material = new THREE.MeshNormalMaterial();
    var geom = new THREE.SphereGeometry(15, 20, 20);
    var mesh = new THREE.Mesh(geom, material);

    scene.add(mesh);

    var getTexture = () => {
        return new THREE.TextureLoader().load("../assets/textures/particles/sprite-sheet.png");
    }

    var controls = {
        size: 150,
        transparent: true,
        opacity: 0.6,
        color: 0xffffff,
        rotate: true,
        redraw: () => {
            sceneOrtho.children.forEach((child) => {
                if (child instanceof THREE.Sprite) {
                    child.geometry.dispose();
                    child.material.dispose();
                    sceneOrtho.remove(child);
                }
            })
            createSprite(controls.size, controls.transparent, controls.opacity, controls.color, controls.sprite);
        }
    }
    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.add(controls, 'rotate').onChange();

    controls.redraw();
    render();

    var step = 0;
    function render() {
        stats.update();

        camera.position.y = Math.sin(step += 0.01) * 20;

        sceneOrtho.children.forEach(function (e) {
          if (e instanceof THREE.Sprite) {
            e.position.x = e.position.x + e.velocityX;
            if (e.position.x > window.innerWidth) {
              e.velocityX = -5;
              controls.sprite += 1;
              e.material.map.offset.set(1 / 5 * (controls.sprite % 4), 0);
            }
            if (e.position.x < 0) {
              e.velocityX = 5;
            }
          }
        });

        requestAnimationFrame(render);
        renderer.render(sceneOrtho, cameraOrtho);
        renderer.autoClear = false;
        renderer.render(scene, camera);
    }

    function createSprite(size, transparent, opacity, color, spirte) {
        var spriteMaterial = new THREE.SpriteMaterial({
            opacity: opacity,
            color: color,
            transparent: transparent,
            map: getTexture()
        });

        spriteMaterial.map.offset = new THREE.Vector3(0.2 * sprite, 0);
        spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
        spriteMaterial.map.blending = THREE.AdditiveBlending;
        spriteMaterial.map.dethTest = false;

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(size, size, size);
        sprite.position.set(100, 50, -10);
        sprite.velocityX = 5;

        sceneOrtho.add(sprite);
    }

}