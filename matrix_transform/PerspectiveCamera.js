( function() {
    function PerspectiveCamera() {
        THREE.PerspectiveCamera.call( this );
        Object3D.call( this );
    }
    
    PerspectiveCamera.prototype = Object.assign( Object.create( THREE.PerspectiveCamera.prototype ), Object3D.prototype, {

    } )

    window.PerspectiveCamera = PerspectiveCamera;
} )();