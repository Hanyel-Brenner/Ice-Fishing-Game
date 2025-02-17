import {generateShader, generateProgram} from './shaderProgram.js';
import { keyboardPressDown, keyboardPressUp, mouseTrack } from './input.js';
import * as camera from './camera.js';
import {degToRad, getFinalMatrix, rotateObjectMatrixY , applyTransformation, radToDeg, trackRod, isInsidePond } from './utils.js';
import { renderCylinder, renderCube, renderObject } from './renderFunctions.js';
import {colors} from './colors.js'
import * as gameState from './gameState.js'
import {landscape, cube, rod, pond, fish, POND_RADIUS} from './objects.js'

gameState.setTime();

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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    var p0 = [0.0, 0.5, 1];
    var pRef = [0.0, 0.0, 0.0];
    var V = [0.0, 1.0, 0.0];
    camera.initialize(p0,pRef);

    var xw_min = -1.0;
    var xw_max = 1.0;
    var yw_min = -1.0;
    var yw_max = 1.0;
    var z_near = -1.0;
    var z_far = -200.0

    var matrix = mat4.create();
    var cameraDir;
    var rodDir;

    function render(){

        camera.updateCamera();
        p0 = camera.getCameraPosition();
        pRef = camera.getReferencePoint();
        cameraDir = camera.getDirection();
        rodDir = rod.getReferenceDirection();   
        trackRod(cameraDir, rodDir, rod, p0);
        var collision = camera.detectCollision();
        var insidePond = isInsidePond(collision.point, pond.getReferencePoint(), POND_RADIUS);

        matrix = getFinalMatrix(p0, pRef, V, xw_min, xw_max, yw_min, yw_max, z_near, z_far)
        gl.uniformMatrix4fv(transfMatrixLoc, false, matrix);
        gl.uniform3fv(lightDirectionLoc, light);

        gl.clearColor(0.51, 0.78, 0.89, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderCube(gl, positionBuffer, colorBuffer, landscape.getPositionArray(), landscape.getColorArray());
        renderCube(gl, positionBuffer, colorBuffer, cube.getPositionArray(), cube.getColorArray());
        renderObject(gl, positionBuffer, colorBuffer, rod.getPositionArray(), rod.getColorArray());
        renderObject(gl, positionBuffer, colorBuffer, pond.getPositionArray(), pond.getColorArray());
        renderObject(gl, positionBuffer, colorBuffer, fish.getPositionArray(), fish.getColorArray());

        if(insidePond && collision.collided == true){
            gameState.setIsFishing(true);
            var rodPos = rod.getPositionArray();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([rodPos[0], rodPos[1], rodPos[2], collision.point[0], collision.point[1], collision.point[2] ]), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),gl.STATIC_DRAW);
            gl.drawArrays(gl.LINES, 0, 2);
        }
        requestAnimationFrame(render);
    }

    render();

}

main();


