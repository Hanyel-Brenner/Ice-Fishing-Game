import {generateShader, generateProgram} from './shaderProgram.js';
import { keyboardPressDown, keyboardPressUp, mouseTrack } from './input.js';
import {setCubeVertices, setCubeColors, setCubeNormals, setCylinderVertices, setCylinderColor, createMatrix, applyTransformation, setLandscapeVertices} from './shapes3d.js';
import * as camera from './camera.js';
import {degToRad, get3DViewingMatrix, getPerspectiveMatrix} from './utils.js';
import { renderCylinder, renderCube } from './renderFunctions.js';

const N_OF_CIRCLE_POINTS = 1000;
const MAX_POINTS = 3;

const color = [[1.0, 0.0, 0.0],  //front, red
                [0.0, 1.0, 0.0],  //left, green
                [0.0 ,0.0, 1.0], //back, blue
                [1.0, 1.0, 0.0],    //right, yellow
                [0.0, 1.0, 1.0],    //top , purple
                [1.0, 0.0, 1.0]];   //bottom, cyan

const color2 = [[0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87]];

/* CUBE DATA*/
var cubePosition = setCubeVertices(0.5);
var cubeColor = setCubeColors(color);
var cubeNormal = setCubeNormals();
/* LANDSCAPE DATA*/
var landscapePosition = setLandscapeVertices(200, 0.5);
var landscapeColor = setCubeColors(color2);
var landscapeMat = createMatrix( [0.0, -0.5, 0.0] ,{ type: 'y', angle: degToRad(0)}, [0.0, 0.0, 0.0]);
landscapePosition = applyTransformation(landscapePosition, landscapeMat);
/* CYLINDER DATA*/
var rodPosition = setCylinderVertices([0.9, 0.9, 0.0],[0.9, 0.0,-0.8], 0.05, N_OF_CIRCLE_POINTS);
var rodColor = setCylinderColor([0.0, 1.0, 0.0], N_OF_CIRCLE_POINTS); 
var rodReelPosition = setCylinderVertices( [ 0.95, 0.1,-0.6], [ 0.99, 0.1 ,-0.7], 0.07, N_OF_CIRCLE_POINTS);
var rodReelColor = setCylinderColor([0.57, 1.0, 0.33], N_OF_CIRCLE_POINTS);
var rodReelMat = createMatrix([-0.95, -0.1, 0.6], {type : 'y', angle : degToRad(90)}, [0.99, 0.1, -0.6 ]);
rodReelPosition = applyTransformation(rodReelPosition, rodReelMat);

var light = [0.5, 0.0, -0.5];

function main() {
    
    const body = document.querySelector('body');
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true } );
    
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    const vertexShaderSrc = document.getElementById('vertexShader').text;
    const fragmentShaderSrc = document.getElementById('fragmentShader').text;

    const vertexShader = generateShader(gl,gl.VERTEX_SHADER,vertexShaderSrc);
    const fragmentShader = generateShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSrc);
    const program = generateProgram(gl, vertexShader, fragmentShader);
    
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);
    
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
/*
*location refers to the location of the attributes defined in shader or fragment glsl
*/
    const positionLocation = gl.getAttribLocation(program,'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program,'color');
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
  
    body.addEventListener("keydown", function(event){
        keyboardPressDown(event);
    },false);

    body.addEventListener("keyup", function(event){
        keyboardPressUp(event);
    },false);

    body.addEventListener("mousemove", function(event){
        mouseTrack(event, canvas);
    },false);

/*
*Definition of transformation matrix, initiating it with identity matrix
*/    
    const transfMatrixLoc = gl.getUniformLocation(program, 'matrix');
    gl.uniformMatrix4fv(transfMatrixLoc, false, mat4.create());

    const lightDirectionLoc = gl.getUniformLocation(program, 'uLightDirection');
    gl.uniform3fv(lightDirectionLoc, light);

/*
*clear screen
*/
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    var p0 = [0.0, 0.0, 2.0];
    var pRef = [0.0, 0.0, 0.0];
    var V = [0.0, 1.0, 0.0];
    camera.initialize(p0,pRef);

    var xw_min = -1.0;
    var xw_max = 1.0;
    var yw_min = -1.0;
    var yw_max = 1.0;
    var z_near = -1.0;
    var z_far = -200.0

    var cameraMatrix = mat4.create();
    var persMatrix = mat4.create();
    var lookAt = mat4.create();
    var model = mat4.create();
    var matrix = mat4.create();
    var lightMatrix = mat4.create();

    console.log("sum of vertices :"+(landscapePosition.length+cubePosition.length+rodPosition.length+rodReelPosition.length));
    console.log("sum of color: "+(landscapeColor.length+cubeColor.length+rodColor.length+rodReelColor.length));

    function render(){

        camera.updateCamera();
        p0 = camera.getCameraPosition();
        pRef = camera.getReferencePoint();

        cameraMatrix = mat4.create();
        persMatrix = mat4.create();
        lookAt = mat4.create();
        model = mat4.create();
        matrix = mat4.create();
        lightMatrix = mat4.create();
        
        cameraMatrix = get3DViewingMatrix(p0, pRef, V);
        persMatrix = getPerspectiveMatrix(xw_min, xw_max, yw_min, yw_max, z_near, z_far);
        mat4.multiply(lookAt, persMatrix, cameraMatrix);
        mat4.multiply(matrix, lookAt, model);

        mat4.rotateY(lightMatrix, lightMatrix, degToRad(0.1));
        vec3.transformMat4(light, light, lightMatrix);

        gl.uniformMatrix4fv(transfMatrixLoc, false, matrix);
        gl.uniform3fv(lightDirectionLoc, light);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderCube(gl, positionBuffer, colorBuffer, landscapePosition, landscapeColor);
        renderCube(gl, positionBuffer, colorBuffer, cubePosition, cubeColor);
        renderCylinder(gl, positionBuffer, colorBuffer, rodPosition, rodColor);
        renderCylinder(gl, positionBuffer, colorBuffer, rodReelPosition, rodReelColor);
        
        requestAnimationFrame(render);
    }

    render();
    
}

main();


