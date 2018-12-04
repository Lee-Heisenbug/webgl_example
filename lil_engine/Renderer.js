( function() {

    function Renderer( domElement ) {
        
        this.domElement = domElement;

        this.gl = domElement.getContext( 'webgl2' );

        this.clearColor = new THREE.Vector4( 0, 0, 0, 1 );
        
        var defaultVAO = this.gl.createVertexArray();

        this.gl.clearColor( this.clearColor.x, this.clearColor.y, this.clearColor.z, this.clearColor.w );

        this.gl.bindVertexArray(defaultVAO);
        
    }

    Renderer.prototype = Object.assign( {}, {

        renderScene( scene, camera ) {

            this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

            camera.updateMatrixWorld();

            camera.matrixWorldInverse.getInverse( camera.matrixWorld );

            this.renderObjectTree( scene, camera.matrixWorldInverse.premultiply( camera.projectionMatrix ) );

        },

        renderObjectTree( objectTree, matrixVP ) {

            if( objectTree.parent ) {

                objectTree.updateMatrix();

                objectTree.matrixWorld.copy( objectTree.matrix );

                objectTree.matrixWorld.premultiply( objectTree.parent.matrixWorld );

            }

            if( objectTree.isMesh ){

                let matrixMVP = objectTree.matrixWorld.clone();
                let u_Color;
                let u_MVPMatrix;

                matrixMVP = matrixMVP.premultiply( matrixVP );

                if( !objectTree.material.glPrograme ){

                    objectTree.material.compileShader( this.gl );

                }

                this.gl.useProgram( objectTree.material.glPrograme )

                if( !objectTree.geometry.VAO ){

                    objectTree.geometry.createVAO( this.gl, objectTree.material.glPrograme );

                    this.gl.bindVertexArray( this.defaultVAO );

                }

                this.gl.bindVertexArray( objectTree.geometry.VAO );

                u_MVPMatrix = this.gl.getUniformLocation( objectTree.material.glPrograme,'u_MVPMatrix' );

                u_Color = this.gl.getUniformLocation( objectTree.material.glPrograme,'u_Color' );

                this.gl.uniformMatrix4fv( u_MVPMatrix, false, new Float32Array( matrixMVP.elements ) );

                this.gl.uniform4f( u_Color, objectTree.material.color.r,
                    objectTree.material.color.g,
                    objectTree.material.color.b, 1.0 );
                
                this.gl.drawElements( this.gl.TRIANGLES, objectTree.geometry.faces.length, this.gl.UNSIGNED_BYTE, 0 );

            }

            var self = this;
            objectTree.children.forEach( child => {
                self.renderObjectTree( child, matrixVP );
            } )
        }

        
    } )

    window.Renderer = Renderer;

} )();