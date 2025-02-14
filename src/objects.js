import { GameObject } from "./gameObject.js";
import {setLandscapeVertices, setCubeVertices, setCubeColors, setCubeNormals, setCylinderVertices, setCylinderColor} from './shapes3d.js'
import { degToRad, rotateObjectMatrixY, applyTransformation, assembleArray } from "./utils.js";

const N_OF_CIRCLE_POINTS = 1000;

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

var rodReelPosition = setCylinderVertices( [ 0.95, 0.1,-0.6], [ 0.99, 0.1 ,-0.7], 0.07, N_OF_CIRCLE_POINTS);
var rodReelColor = setCylinderColor([0.57, 1.0, 0.33], N_OF_CIRCLE_POINTS);
var rodReelMat = rotateObjectMatrixY( rodReelPosition, degToRad(90), [0.95, 0.1,-0.6]);
rodReelPosition = applyTransformation(rodReelPosition, rodReelMat);

var landscape = new GameObject();
landscape.setPositionArray(landscapePosition);
landscape.setColorArray(landscapeColor);
landscape.setNormalArray(landscapeNormal);

var rod = new GameObject();
rod.setPositionArray(assembleArray([rodPosition, rodReelPosition]));
rod.setColorArray(assembleArray([rodColor, rodReelColor]));

var cube = new GameObject();
cube.setPositionArray(cubePosition);
cube.setColorArray(cubeColor);
cube.setNormalArray(cubeNormal);

export {landscape , cube, rod}