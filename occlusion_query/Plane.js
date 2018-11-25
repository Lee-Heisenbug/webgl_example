function Plane(gl, vertices, color){

    this.gl = gl;
    this.vao = gl.createVertexArray();
    this.color = color;
    this.matrix4 = new THREE.Matrix4();
    
    var faces = new Uint8Array([
        0, 1, 2,
        0, 2, 3
    ]);
    
    vertices = new Float32Array(vertices);

    gl.bindVertexArray(this.vao);
    initArrayBuffer(gl, 'a_Position', gl.FLOAT, vertices, 2)
    initElementArrayBuffer(gl, faces);
    gl.bindVertexArray(defaultVAO);

}

Object.assign(Plane.prototype, {
    draw: function(){
        var gl = this.gl;
        
        var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
        var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

        gl.uniform4fv(u_Color, this.color);
        gl.uniformMatrix4fv( u_xformMatrix, false, this.matrix4.elements);

        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
        gl.bindVertexArray(defaultVAO);
    }
})