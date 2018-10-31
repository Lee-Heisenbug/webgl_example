var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec3 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = vec4(a_Color, 1.0);
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`;

let nOV = 1;
const posSize = 2;
const colorSize = 3;
const FSIZE = 4;
let buffer, posLocation, colorLocation;

let canvas = document.getElementById('scene-3d');
let gl = canvas.getContext('webgl2');


initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
initBuffer();
draw();
let ctrlBtn = document.getElementById('ctrl');
ctrlBtn.addEventListener('click',()=>{
    updateBufferData();
    draw();
})

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

function initBuffer(){
    buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 1.0, 1.0
    ]), gl.STATIC_DRAW);

    posLocation = gl.getAttribLocation(gl.program, 'a_Position');
    colorLocation = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(posLocation);
    gl.enableVertexAttribArray(colorLocation);
}

function updateBufferData(){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
        Math.random() * 2 - 1, Math.random() * 2 - 1,
        Math.random(), Math.random(), Math.random()
    ]), 0);
};

function draw(){
    gl.clearColor(0,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.POINTS, 0, nOV);
}

