( function() {

    function BasicMaterial( color ) {

        Material.call( this, color );

    }

    BasicMaterial.prototype = Object.assign( Object.create( Material.prototype ), {
        
        vertexShader : `
            attribute vec4 a_Position;
            uniform mat4 u_MVPMatrix;
            void main(){
                gl_Position = u_MVPMatrix * a_Position;
                // v_Color = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `,

        segmentShader: `
            precision mediump float;
            uniform vec4 u_Color;
            void main(){
                gl_FragColor = u_Color;
            }
        `
        
    } );

    window.BasicMaterial = BasicMaterial;

} )()