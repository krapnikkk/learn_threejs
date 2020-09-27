function BaseLoaderScene(providedCamera, shouldAddLights, shouldRotate, updateMesh) {

    this.scene = new THREE.Scene();
    this.stats = initStats();
    this.clock = new THREE.Clock();
    this.camera = providedCamera;
    this.withLights = (shouldAddLights !== undefined) ? shouldAddLights : true;
    this.shouldRotate = (shouldRotate !== undefined) ? shouldRotate : true;
    this.updateMesh = updateMesh

    this.renderer = initRenderer({
        antialias: true
    });

    this.trackballControls = initTrackballControls(this.camera, this.renderer);

    this.render = (mesh, camera) => {
        this.scene.add(mesh);
        this.camera = camera;
        this.mesh = mesh;
        this._render();
    }

    this._render = () => {
        this.stats.update();
        requestAnimationFrame(this._render);
        this.trackballControls.update(this.clock.getDelta());

        if (updateMesh) this.updateMesh(this.mesh)

        if (shouldRotate) {
            this.mesh.rotation.z += 0.01
        }

        this.renderer.render(this.scene, this.camera);
    }

    this._addLights = function () {
        var keyLight = new THREE.SpotLight(0xffffff);
        keyLight.position.set(00, 80, 80);
        keyLight.intensity = 2;
        keyLight.lookAt(new THREE.Vector3(0, 15, 0));
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.height = 4096;
        keyLight.shadow.mapSize.width = 4096;
        this.scene.add(keyLight);

        var backlight1 = new THREE.SpotLight(0xaaaaaa);
        backlight1.position.set(150, 40, -20);
        backlight1.intensity = 0.5;
        backlight1.lookAt(new THREE.Vector3(0, 15, 0));
        this.scene.add(backlight1);

        var backlight2 = new THREE.SpotLight(0xaaaaaa);
        backlight2.position.set(-150, 40, -20);
        backlight2.intensity = 0.5;
        backlight2.lookAt(new THREE.Vector3(0, 15, 0));
        this.scene.add(backlight2);
    }

    if (this.withLights) this._addLights();

}