var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0, 0, 1.0);
    }
`;

canvas = document.getElementById('scene-3d');
gl = canvas.getContext('webgl');


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
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;

    // create buffer
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('failed to create the buffer object ');
        return -1;
    }

    // bind buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );

    // transfer the js buffer to gl buffer
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // get the position of position attribute
    var a_Position = gl.getAttribLocation( gl.program, 'a_Position' );
    if(a_Position < 0){
        console.warn('Failed to get the location of a_Position');
    }

    // assign the gl buffer to the position attribute
    gl.vertexAttribPointer( a_Position, 2, gl.FLOAT, false, 0, 0 );

    // link a_Position and the assigned buffer
    gl.enableVertexAttribArray( a_Position );

    return n;
};

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

var nOV = initVetexBuffers( gl );

gl.clearColor(0,1,1,1);
gl.clear(gl.COLOR_BUFFER_BIT);

// gl.drawArrays(gl.POINTS, 0, 2);
gl.drawArrays(gl.POINTS, 0, nOV);
