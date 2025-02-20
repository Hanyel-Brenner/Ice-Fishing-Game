import {generateShader, generateProgram} from './shaderProgram.js';
import { keyboardPressDown, keyboardPressUp, mouseTrack } from './input.js';
import * as camera from './camera.js';
import {degToRad, getFinalMatrix, rotateObjectMatrixY , applyTransformation, radToDeg, trackRod, isInsidePond } from './utils.js';
import { renderCylinder, renderCube, renderObject } from './renderFunctions.js';
import {colors} from './colors.js'
import * as gameState from './gameState.js'
import {landscape, cube, rod, pond, fish, POND_RADIUS} from './objects.js'
import * as input from './input.js' 

//gameState.setTime();

var light = [0.0, 0.0, -0.5];

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

    const normalLocation = gl.getAttribLocation(program, 'normal');
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  
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

 
    const lightDirection = vec3.fromValues(0.0, 1.0, 0.0); // Exemplo de direção da luz (apontando para cima)
    const lightDirectionLoc = gl.getUniformLocation(program, 'uLightDirection');
    gl.uniform3fv(lightDirectionLoc, lightDirection);
    
    const useNormalsLoc = gl.getUniformLocation(program, 'useNormals');
    gl.uniform1i(useNormalsLoc, 1); // Ativar o uso de normais
    
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

    var colPoint = [0.0, 0.0, 0.0];
    var fishingStart = gameState.getTime();
    var fishingEnd = gameState.getTime();

    function render(){

        if(gameState.getIsRunning()){
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

            gl.uniform1i(useNormalsLoc, 1);
            renderCube(gl, positionBuffer, colorBuffer, normalBuffer, landscape.getPositionArray(), landscape.getColorArray(), landscape.getNormalArray());
            renderCube(gl, positionBuffer, colorBuffer, normalBuffer,cube.getPositionArray(), cube.getColorArray(), cube.getNormalArray());
            renderObject(gl, positionBuffer, colorBuffer, normalBuffer,pond.getPositionArray(), pond.getColorArray(), pond.getNormalArray);

            gl.uniform1i(useNormalsLoc, 0);
            renderObject(gl, positionBuffer, colorBuffer, normalBuffer,rod.getPositionArray(), rod.getColorArray(), rod.getNormalArray());

            var fishMatrix = rotateObjectMatrixY(fish.getReferencePoint(), degToRad(0), pRef);
            fish.setReferencePoint(pRef);
            fish.setPositionArray(applyTransformation(fish.getPositionArray(), fishMatrix));

            if(gameState.getIsHoldingFish() == true){
                renderObject(gl, positionBuffer, colorBuffer, normalBuffer, fish.getPositionArray(), fish.getColorArray(), fish.getNormalArray());
                if(input.keysPressed[32] == true){
                    gameState.setIsHoldingFish(false);
                }
            }

            if(insidePond && collision.collided == true && gameState.getIsFishing() == false){
                gameState.setIsFishing(true);
                gameState.setFishingProgress(50); //min is 0 and max is 100;
                fishingStart = gameState.getTime();
                colPoint = collision.point;
            }

            if(gameState.getIsFishing() == true){
                var rodPos = rod.getPositionArray();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([rodPos[0], rodPos[1], rodPos[2], colPoint[0], colPoint[1], colPoint[2] ]), gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),gl.STATIC_DRAW);
                gl.drawArrays(gl.LINES, 0, 2);
                gameState.incrementFishingProgress(-0.1);
                if(input.keysPressed[67] == true){
                    gameState.incrementFishingProgress(0.5);
                }//letra c
                if(gameState.getFishingProgress() <= 30 || gameState.getFishingProgress() >= 100){
                    gameState.setIsFishing(false);
                    console.log("você perdeu o peixe, seu inútil!!");
                }
                fishingEnd = gameState.getTime();
                console.log(gameState.getFishingProgress());
            }

            if(gameState.getIsFishing() == true && fishingEnd - fishingStart >= 25){
                gameState.setIsFishing(false);
                gameState.setIsHoldingFish(true);
                gameState.incrementFishQuantity();
                gameState.setFishingProgress(50);
                console.log("você pescou mais um peixe!");
                console.log("você não está mais pescando...");
            }

            if(gameState.getTime() >= 240) {
                console.log("Game is finished, and so are you...");
                gameState.setIsRunning(false);
            }

        }
        requestAnimationFrame(render);
    }

    render();

}

main();


