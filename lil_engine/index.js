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

camera.position.z = 5;
camera.far = 50;

function render(){
    renderer.renderScene(scene,camera);
}

render();

var gui = new dat.GUI();

cubes.forEach( ( cube, index ) => {
    var cubeFolder = gui.addFolder('cube'+index);

    ['position', 'rotation', 'scale'].forEach( property => {
        var proFolder = cubeFolder.addFolder( property );

        ['x', 'y', 'z'].forEach( axis => {
            proFolder.add( cube[property], axis, -2, 2 ).onChange(render);
        } )

    } )
} );

var cameraFolder = gui.addFolder('camera');
['fov', 'aspect', 'near', 'far'].forEach( property => {

    cameraFolder.add( camera, property ).onChange( () => {
        camera.updateProjectionMatrix();
        render();
    } );

} )