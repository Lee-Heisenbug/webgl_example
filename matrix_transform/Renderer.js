( function() {

    function Renderer( domElement ) {
        
        this.domElement = domElement;

        this.gl = domElement.getContext('webgl2');
        
        var defaultVAO = this.gl.createVertexArray();

        this.gl.bindVertexArray(defaultVAO);
        
    }

    Renderer.prototype = Object.assign( {}, {

        renderScene( scene, camera ) {

            camera.updateMatrixWorld;

            camera.matrixWorldInverse.getInverse( camera.matrixWorld );

            this.renderObjects( scene, camera.matrixWorldInverse.preMultiply( camera.projectionMatirx ) );

        },

        renderObjectTree( objectTree, matrixVP ) {

            if( objectTree.parent ) {

                objectTree.matrixWorld.copy( objectTree.matrix );

                objectTree.matrixWorld.preMultiply( objectTree.parent.matrixWorld );

            }

            if( objectTree.isMesh ){

                let matrixMVP = objectTree.matrixWorld.clone();
                let u_Color;
                let u_MVPMatrix;

                matrixMVP = matrixMVP.preMultiply( matrixVP );

                if( !objectTree.material.glPrograme ){

                    objectTree.material.compilePrograme( this.gl );

                }

                this.gl.usePrograme( objectTree.material.glPrograme )

                if( !objectTree.geometry.VAO ){

                    objectTree.geometry.createVAO( gl, glPrograme );

                    this.gl.bindVertexArray( this.defaultVAO );

                }

                this.gl.bindVertexArray( objectTree.geometry.VAO );

                u_MVPMatrix = this.gl.getUniformLocation( objectTree.material.glPrograme,'u_MVPMatrix' );

                u_Color = this.gl.getUniformLocation( objectTree.material.glPrograme,'u_Color' );

                this.gl.uniformMatrix4fv( u_Color, false, matrixMVP.elements );

                this.gl.uniform3f( u_Color, objectTree.material.color.r,
                    objectTree.material.color.g,
                    objectTree.material.color.b, );
                
                this.gl.drawElements( gl.TRIANGLES, objectTree.geometry.faces.length, gl.UNSIGNED_BYTE, 0 );

            }
        }

        
    } )

    window.Renderer = Renderer;

} )

