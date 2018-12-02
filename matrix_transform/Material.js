(function() {

    function Material() {

        this.color = new THREE.Color();
    }

    Material.prototype = Object.assign( {}, {

        vertexShader : '',

        segmentShader: '',

        glPrograme: null,

        complieShader: function( gl ) {
            this.glPrograme = initShaders( gl, this.vertexShader, this.segmentShader );
            return this.glPrograme;
        }

    } )

    window.Material = Material;
    
})();