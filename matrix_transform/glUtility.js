function initShaders(gl, vshaderSource, fshaderSource){

    var vertexShader = gl.createShader(gl.VERTEX_SHADER), 
        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER), 
        program = gl.createProgram();

    gl.shaderSource(vertexShader, vshaderSource);
    gl.shaderSource(fragmentShader, fshaderSource);

    gl.compileShader(vertexShader);
    if( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ){
        console.error( "fail to compile shader." );
        console.error( gl.getShaderInfoLog( vertexShader ) );
    }

    gl.compileShader(fragmentShader);
    if( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ){
        console.error( "fail to compile shader." );
        console.error( gl.getShaderInfoLog( fragmentShader ) );
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if( !gl.getProgramParameter(program, gl.LINK_STATUS ) ){
        console.error( "program is not linked." );
        console.error( gl.getProgramInfoLog( program ) );
    }

    return program;
}

function initArrayBuffer(gl, glPrograme, attrName, type, data, num){
    var buffer = gl.createBuffer();
    var attrLocation = gl.getAttribLocation(glPrograme, attrName);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attrLocation, num, type, false, 0, 0);
    gl.enableVertexAttribArray(attrLocation);

    return buffer;
}

function initElementArrayBuffer(gl, data){
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
}