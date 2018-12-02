(function () {

    function Geometry( vertices, faces, colors ) {

        this.vertices = vertices || [];
        this.faces = faces || [];
        // this.colors = colors || [];
        this.VAO = null;
    
    }

    Geometry.prototype = Object.assign( {}, {

        createVAO( gl, glPrograme ) {

            this.VAO = gl.createVertexArray();
            gl.bindVertexArray( this.VAO );

            initArrayBuffer( gl, glPrograme, gl.FLOAT, new Float32Array( this.vertices ), 3);

            initElementArrayBuffer( gl, new Uint8Array( this.faces ) );
            
        }
    } )

    window.Geometry = Geometry;

})();

