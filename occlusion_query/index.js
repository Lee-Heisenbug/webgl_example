var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main(){
        gl_Position = u_xformMatrix * a_Position;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_Color;
    void main(){
        gl_FragColor = u_Color;
    }
`;

canvas = document.getElementById('scene-1');
gl = canvas.getContext('webgl2');
const defaultVAO = gl.createVertexArray();
gl.bindVertexArray(defaultVAO);

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

var bluePlane = new Plane(gl, [
    0.5, 0.5,
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
], [
    0.0,0.0,1.0,1.0
]);

var redPlane = new Plane(gl, [
    0.25, 0.25,
    -0.25, 0.25,
    -0.25, -0.25,
    0.25, -0.25,
], [
    1.0,0.0,0.0,1.0
]);

gl.clearColor(0,0,0,1);

gl.enable(gl.DEPTH_TEST);

draw();

document.onkeydown = function(e){
    var step = 0.01;
    var rPos = new THREE.Vector3();
    rPos.setFromMatrixPosition(redPlane.matrix4);
    switch(e.key){
        case "ArrowUp": rPos.z -= step; break;
        case "ArrowDown": rPos.z += step; break;
        case "ArrowRight": rPos.x += step; break;
        case "ArrowLeft": rPos.x -= step; break;
    }
    redPlane.matrix4.setPosition(rPos);
    draw();
}


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


function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    bluePlane.draw();

    var query = gl.createQuery();
    gl.beginQuery(gl.ANY_SAMPLES_PASSED, query);
    redPlane.draw();
    gl.endQuery(gl.ANY_SAMPLES_PASSED);
    getQueryMsg(query);
}

function getQueryMsg(query){
    if(gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)){
        var queryResult = gl.getQueryParameter(query, gl.QUERY_RESULT);
        document.getElementById('msg').textContent = queryResult;
        gl.deleteQuery(query);
        console.log('done');
    }else{
        requestAnimationFrame(function(){
            getQueryMsg(query);
        })
    }
}