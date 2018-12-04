(function() {

    function Object3D() {
        this.matrix = new THREE.Matrix4();

        this.matrixWorld = new THREE.Matrix4();
    
        this.position = new THREE.Vector3();
    
        this.rotation = new THREE.Euler();
    
        this.scale = new THREE.Vector3( 1, 1, 1 );

        this.children = [];

        this.parent = null;
    }

    Object3D.prototype = Object.assign( {}, {

        isObject3D: true,

        add: function( child ) {
            
            if( child.isObject3D ) {

                child.parent = this;

                this.children.push( child );

            }

        },

        updateMatrixWorld: function() {

            let currentParent = this;

            this.updateMatrix();

            this.matrixWorld.copy( this.matrix );

            while( currentParent.parent !== null) {

                currentParent = currentParent.parent;

                currentParent.updateMatrix();

                this.matrixWorld.premultiply( currentParent.matrix );

            };

            return this.matrixWorld;

        },

        updateMatrix: function() {
            
            this.matrix.compose( this.position, ( new THREE.Quaternion ).setFromEuler( this.rotation ), this.scale );

            return this.matrix;

        }

    } )

    window.Object3D = Object3D;

})();
