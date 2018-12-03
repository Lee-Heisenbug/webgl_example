var renderer, camera, cubeSettings, cubes, scene;

renderer = new Renderer( document.getElementById('scene') );
camera = new PerspectiveCamera();

cubeSettings = [{
    size: 0.5,
    color: 0xff0000
},{
    size: 0.3,
    color: 0x00ff00
}]

cubes = cubeSettings.map( cubeSetting => {
    return new Cube( cubeSetting.size, cubeSetting.color );
} );

scene = new Object3D();

scene.add( cubes[0] );
scene.add( cubes[1] );

function render(){
    renderer.renderScene(scene,camera);
}

render();