import { colors } from "./colors.js";
import { GameObject } from "./gameObject.js";
import { setCircleColor } from "./shapes2d.js";
import {setLandscapeVertices, setCubeVertices, setCubeColors, setCubeNormals, setCylinderVertices, setCylinderColor, setCircleVertices3d} from './shapes3d.js'
import { degToRad, rotateObjectMatrixY, rotateObjectMatrixX ,applyTransformation, assembleArray } from "./utils.js";

const N_OF_CIRCLE_POINTS = 1000;
//This rod initial position will be defined as a reference point for the rod and will be used mainly to determine in the beggining
//how to translate the rod to the hands of the player, because after the first time, the reference point will be updated at each 
//game cycle. It will be used also to define the location of the handle's base of the rod to draw it the first time.
const ROD_INITIAL_POSITION = [0.9, 0.0,-0.8];
export const POND_RADIUS = 0.8;


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

/*CUBE DATA*/
var cubePosition = setCubeVertices(0.5);
var cubeColor = setCubeColors(color);
var cubeNormal = setCubeNormals();
/* LANDSCAPE DATA*/
var landscapePosition = setLandscapeVertices(200, 0.5);
var landscapeColor = setCubeColors(color2);
var landscapeNormal = setCubeNormals();
var landscapeMat = rotateObjectMatrixY( landscapePosition, degToRad(45), [200, -0.5, 0.0]);
landscapePosition = applyTransformation(landscapePosition, landscapeMat);
/* ROD DATA*/
var rodPosition = setCylinderVertices([0.9, 0.9, 0.0],[0.9, 0.0,-0.8], 0.05, N_OF_CIRCLE_POINTS);
var rodColor = setCylinderColor([0.0, 1.0, 0.0], N_OF_CIRCLE_POINTS);
var rodMat = mat4.create();
mat4.translate(rodMat, rodMat, [0.0, -0.5, 0.0]);
rodPosition = applyTransformation(rodPosition, rodMat);

var rodReelPosition = setCylinderVertices( [ 0.95, 0.1,-0.6], [ 0.99, 0.1 ,-0.7], 0.1, N_OF_CIRCLE_POINTS);
var rodReelColor = setCylinderColor([0.57, 1.0, 0.33], N_OF_CIRCLE_POINTS);
var rodReelMat = rotateObjectMatrixY( rodReelPosition, degToRad(95), [0.95, -0.3,-0.6]);
rodReelPosition = applyTransformation(rodReelPosition, rodReelMat);

/* POND DATA*/
var pondPosition = setCircleVertices3d([0.5 ,0.5, -1.8], POND_RADIUS , N_OF_CIRCLE_POINTS);
var pondColor = setCircleColor(colors.blue);

var landscape = new GameObject();
landscape.setReferencePoint([0.0, 0.0, 0.0]);
landscape.setPositionArray(landscapePosition);
landscape.setColorArray(landscapeColor);
landscape.setNormalArray(landscapeNormal);

var rod = new GameObject();
rod.setReferencePoint(ROD_INITIAL_POSITION);
rod.setReferenceDirection([0.0, 0.0, 1.0]);
rod.setPositionArray(assembleArray([rodPosition, rodReelPosition]));
rod.setColorArray(assembleArray([rodColor, rodReelColor]));

var cube = new GameObject();
cube.setReferencePoint([0.0, 0.0, 0.0]);
cube.setPositionArray(cubePosition);
cube.setColorArray(cubeColor);
cube.setNormalArray(cubeNormal);

var pond = new GameObject();
pond.setReferencePoint([0.5 ,0.5, -1.8]);
var pondMatrix = rotateObjectMatrixX(pond.getReferencePoint(), degToRad(90) , [ 0.5 ,-0.45, -1.8]);
pond.setPositionArray(applyTransformation(pondPosition, pondMatrix));
pond.setColorArray(pondColor);

export {landscape , cube, rod, pond}