( function() {

    function Mesh( geometry, material ) {

        Object3D.call( this );
    
        this.geometry = geometry;
        this.material = material;
    
    }

    Mesh.prototype = Object.assign( Object.create( Object3D.prototype ), {
        isMesh: true
    } )

    window.Mesh = Mesh;
    
} )();

