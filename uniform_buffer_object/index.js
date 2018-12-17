var VSHADER_SOURCE = `\
    #version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform TransformBlock{
        mat4 u_ProjMatrix;
        mat4 u_ViewMatrix;
        mat4 u_ModelMatrix;
    };
    out vec4 v_Color;
    void main(){
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `\
    #version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 o_fragColor;
    void main(){
        o_fragColor = v_Color;
    }
`;

canvas = document.getElementById('scene-3d');
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
        // cube vertices
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0,//front
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,

        1.0, 1.0, -1.0, 1.0, 1.0, 1.0,// right
        1.0, -1.0, 1.0, 1.0, -1.0, -1.0,

        1.0, 1.0, -1.0, -1.0, 1.0, -1.0,// up
        -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,

        -1.0, 1.0, -1.0, -1.0, -1.0, -1.0,// left
        -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,

        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,// button
        1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,// back
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0
    ]);

    var colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,//front

        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,// right

        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,// up

        1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,// left

        0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,// bottom

        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 //back
    ]);

    var faces = new Uint8Array([
        0, 1, 2, 0, 2, 3,//front
        4, 5, 6, 4, 6, 7,//right
        8, 9, 10, 8, 10, 11,//up
        12, 13, 14, 12, 14, 15,//left
        16, 17, 18, 16, 18, 19,//bottom
        20, 21, 22, 20, 22, 23 //back
    ]);

    initArrayBuffer(gl, 'a_Position', gl.FLOAT, vertices, 3);
    initArrayBuffer(gl, 'a_Color', gl.FLOAT, colors, 3);
    initElementArrayBuffer(gl, faces);


    function initArrayBuffer(gl, attribute, type, data, num){
        var buffer = gl.createBuffer();
        var attrLocation;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        attrLocation = gl.getAttribLocation(gl.program, attribute);
        gl.vertexAttribPointer(attrLocation, num, type, false, 0, 0);
        gl.enableVertexAttribArray(attrLocation);

        return true;
    }

    function initElementArrayBuffer(gl, data){
        var buffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        return true;
    }

    return faces.length;
};

initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

var nOE = initVetexBuffers( gl );

var projMatrix = new THREE.Matrix4();
var viewMatrix = new THREE.Matrix4();
var viewRotationMatrix = new THREE.Matrix4();
var viewRotationQua = new THREE.Quaternion();
var modelMatrix = new THREE.Matrix4();
var modelRotation = new THREE.Euler();
var cameraPos = new THREE.Vector3(0,0,5);
var g_near = 1, g_far = 100;
var fov = 40;
var aspect = 1;
var u_TransformBlock;
var transformBuffer = gl.createBuffer();
var bufferSize = 192;
var bindingPoint = 1;

modelRotation.reorder("YXZ");

viewRotationMatrix.lookAt(cameraPos, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
viewRotationQua.setFromRotationMatrix(viewRotationMatrix);
viewMatrix.compose(cameraPos, viewRotationQua, new THREE.Vector3(1,1,1));
viewMatrix.getInverse(viewMatrix);

var verticalLength = Math.tan(fov / 2 * Math.PI / 180) * g_near;
var horizontalLength = verticalLength * aspect;
projMatrix.makePerspective(-verticalLength,verticalLength,horizontalLength,-horizontalLength,g_near,g_far);

u_TransformBlock = gl.getUniformBlockIndex(gl.program, 'TransformBlock');
gl.bindBuffer(gl.UNIFORM_BUFFER, transformBuffer);
gl.bufferData(gl.UNIFORM_BUFFER, bufferSize, gl.DYNAMIC_DRAW);
gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingPoint, transformBuffer);
gl.uniformBlockBinding(gl.program, u_TransformBlock, bindingPoint);

function bufferTransformData(){
    [projMatrix, viewMatrix, modelMatrix].forEach(function( matrix, index ){
        gl.bufferSubData( gl.UNIFORM_BUFFER, bufferSize / 3 * index, new Float32Array(matrix.elements), 0 );
    });
}

gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

document.onkeydown = function(e){
    var step = 0.01;
    switch(e.key){
        case "ArrowUp": modelRotation.x += step; break;
        case "ArrowDown": modelRotation.x -= step; break;
        case "ArrowRight": modelRotation.y += step; break;
        case "ArrowLeft": modelRotation.y -= step; break;
    }
    console.log('fov',fov);
    draw();
}

function draw(){
    document.getElementById('y').innerText = modelRotation.y;
    document.getElementById('x').innerText = modelRotation.x;
    modelMatrix.makeRotationFromEuler(modelRotation);
    
    bufferTransformData();
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, nOE, gl.UNSIGNED_BYTE, 0);
}

draw();