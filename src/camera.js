import * as input from './input.js';
import { unitVector, perpendicularVectorClockwise, degToRad } from './utils.js';

var x0, y0, z0;
var xRef, yRef, zRef;

export function initialize(p0, pRef){
  x0 = p0[0];
  y0 = p0[1];
  z0 = p0[2];
  xRef = pRef[0];
  yRef = pRef[1];
  zRef = pRef[2];
}

export function getCameraPosition(){
  return [x0, y0, z0];
}

export function getReferencePoint(){
  return [xRef, yRef, zRef];
}

export function updateCamera(){

  var direction = unitVector([xRef - x0, 0 , zRef - z0]);
  var theta = vec3.angle(direction, [1.0, 0.0, 0.0]);
  var rightDirection = perpendicularVectorClockwise([direction[0], direction[2]]);
  var omega = vec3.angle([rightDirection[0], 0, rightDirection[1]], [1.0, 0.0, 0.0]);
  
  var dxFront, dzFront;
  var dxSide, dzSide;

  if( z0 > zRef){
    dxFront = Math.cos(theta);
    dzFront = -(Math.sin(theta));
  }else{
    dxFront = Math.cos(theta);
    dzFront = (Math.sin(theta));
  }

  if(rightDirection[1] < 0){
    dxSide = Math.cos(omega);
    dzSide = -(Math.sin(omega));
  }else{
    dxSide = Math.cos(omega);
    dzSide = (Math.sin(omega));
  }

  if(input.keysPressed[87] == true) {
    z0 += dzFront * 0.05;
    zRef += dzFront * 0.05;
    x0 += dxFront * 0.05;
    xRef += dxFront * 0.05;
  } //w
  if(input.keysPressed[83] == true) {
    z0 -= dzFront * 0.05;
    zRef -= dzFront * 0.05;
    x0 -= dxFront * 0.05;
    xRef -= dxFront * 0.05;
  } //s
  if(input.keysPressed[68] == true) {
    z0 += dzSide * 0.05;
    zRef += dzSide * 0.05;
    x0 += dxSide * 0.05;
    xRef += dxSide * 0.05;
  }; //d
  if(input.keysPressed[65] == true) {
    z0 -= dzSide * 0.05;
    zRef -= dzSide * 0.05;
    x0 -= dxSide * 0.05;
    xRef -= dxSide * 0.05;
    }; //a

  if(input.keysPressed[38] == true) {
    var old_pRef = [xRef, yRef, zRef];
    var new_pRef = [0.0, 0.0, 0.0];
    var matrix = mat4.create();
    mat4.translate(matrix, matrix ,[x0, y0, z0]);
    mat4.rotateX(matrix, matrix, degToRad(1.5));
    mat4.translate(matrix, matrix, [-x0, -y0, -z0]);
    vec3.transformMat4(new_pRef, old_pRef, matrix);

    xRef = new_pRef[0];
    yRef = new_pRef[1];
    zRef = new_pRef[2];
  } //ArrowUp

  if(input.keysPressed[40] == true) {
    var old_pRef = [xRef, yRef, zRef];
    var new_pRef = [0.0, 0.0, 0.0];
    var matrix = mat4.create();
    mat4.translate(matrix, matrix ,[x0, y0, z0]);
    mat4.rotateX(matrix, matrix, degToRad(-1.5));
    mat4.translate(matrix, matrix, [-x0, -y0, -z0]);
    vec3.transformMat4(new_pRef, old_pRef, matrix);

    xRef = new_pRef[0];
    yRef = new_pRef[1];
    zRef = new_pRef[2];
  } //ArrowDown

  if(input.keysPressed[39] == true){

    var old_pRef = [xRef, yRef, zRef];
    var new_pRef = [0.0, 0.0, 0.0];
    var matrix = mat4.create();
    mat4.translate(matrix, matrix ,[x0, y0, z0]);
    mat4.rotateY(matrix, matrix, degToRad(-1.5));
    mat4.translate(matrix, matrix, [-x0, -y0, -z0]);
    vec3.transformMat4(new_pRef, old_pRef, matrix);

    xRef = new_pRef[0];
    yRef = new_pRef[1];
    zRef = new_pRef[2];

  }//arrowRight

  if(input.keysPressed[37] == true){

    var old_pRef = [xRef, yRef, zRef];
    var new_pRef = [0.0, 0.0, 0.0];
    var matrix = mat4.create();
    mat4.translate(matrix, matrix ,[x0, y0, z0]);
    mat4.rotateY(matrix, matrix, degToRad( 1.5 ));
    mat4.translate(matrix, matrix, [-x0, -y0, -z0]);
    vec3.transformMat4(new_pRef, old_pRef, matrix);

    xRef = new_pRef[0];
    yRef = new_pRef[1];
    zRef = new_pRef[2];

  }//arrowLeft

}

