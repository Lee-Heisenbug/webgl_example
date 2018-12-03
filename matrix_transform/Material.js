(function() {

    function Material( color ) {

        this.color = new THREE.Color( color );
    }

    Material.prototype = Object.assign( {}, {

        vertexShader : '',

        segmentShader: '',

        glPrograme: null,

        compileShader: function( gl ) {
            this.glPrograme = initShaders( gl, this.vertexShader, this.segmentShader );
            return this.glPrograme;
        }

    } )

    window.Material = Material;
    
})();