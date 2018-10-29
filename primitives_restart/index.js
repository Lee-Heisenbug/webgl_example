var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        v_Color = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`;

canvas = document.getElementById('scene-1');
gl = canvas.getContext('webgl2');

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

    gl.useProgram(program);
    gl.program = program;
}

function initVetexBuffers(gl){
    
    //create js buffer
    var vertices = new Float32Array([
        -1, 0.5,
        -0.5, -0.5,
        -0.5, 0.5,
        0, -0.5,
        0, 0.5,
        0.5, -0.5,
        0.5, 0.5,
        1, -0.5
    ]);

    // var faces = new Uint8Array([
    //     0, 1, 2,
    //     1, 2, 3,
    //     2, 3, 4,
    //     3, 4, 5,
    //     4, 5, 6,
    //     5, 6, 7
    // ]);

    var faces = new Uint8Array([
        0, 1, 2, 3,
        255,
        4, 5, 6, 7
    ]);

    initArrayBuffer(gl, 'a_Position', gl.FLOAT, vertices, 2);
    initElementArrayBuffer(gl, faces);

    function initArrayBuffer(gl, attribute, type, data, num){
        var buffer = gl.createBuffer();
        var attrLocation = gl.getAttribLocation(gl.program, attribute);

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

    return faces.length;
};

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

var nOE = initVetexBuffers( gl );

gl.clearColor(0,0,0,1);

function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLE_STRIP, nOE, gl.UNSIGNED_BYTE, 0);
}

draw();
