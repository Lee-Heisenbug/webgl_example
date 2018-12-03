( function() {
    function Cube( size, color ) {
        Mesh.call( this,
            new Geometry( [
                size, size, size,
                -size, size, size,
                -size, -size, size,
                size, -size, size,

                size, size, -size,
                -size, size, -size,
                -size, -size, -size,
                size, -size, -size,
            ], [
                0, 1, 2,
                0, 2, 3,

                5, 4, 7,
                5, 7, 6,

                4, 5, 1,
                4, 1, 0,

                3, 2, 6,
                3, 6, 7,

                4, 0, 3,
                4, 3, 7,

                1, 5, 6,
                1, 6, 2
            ] ),
            new BasicMaterial( color )
        )
    }

    Cube.prototype = Object.assign( Object.create( Mesh.prototype ), {} )

    window.Cube = Cube;
} )();