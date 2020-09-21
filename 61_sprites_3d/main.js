function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(20, 0, 150));
    camera.lookAt(new THREE.Vector3(20,30,0));

    var getTexture = () => {
        return new THREE.TextureLoader().load("../assets/textures/particles/sprite-sheet.png");
    }

    createSprites();
    render();

    var group;
    function render() {
        stats.update();
        group.rotation.x +=0.01;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createSprites() {
        group = new THREE.Object3D();
        var range = 200;
        for (var i = 0; i < 400; i++) {
            group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range));
        }
        scene.add(group);
    }

    function createSprite(size, transparent, opacity, color, spriteId,range ) {
        var spriteMaterial = new THREE.SpriteMaterial({
            opacity: opacity,
            color: color,
            transparent: transparent,
            map: getTexture()
        });

        spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteId, 0);
        spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
        spriteMaterial.blending = THREE.AdditiveBlending;
        spriteMaterial.depthTest = false;

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(size, size, size);
        sprite.position.set(Math.random()*range-range/2, Math.random()*range-range/2, Math.random()*range-range/2);
        return sprite;
    }

}