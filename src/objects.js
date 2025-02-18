import { colors } from "./colors.js";
import { GameObject } from "./gameObject.js";
import { setCircleColor } from "./shapes2d.js";
import {setLandscapeVertices, setCubeVertices, setCubeColors, setCubeNormals, setCylinderVertices, setCylinderColor, setCircleVertices3d, setEllipsoidVertices, setEllipsoidColor, setRectangle3dVertices} from './shapes3d.js'
import { degToRad, rotateObjectMatrixY, rotateObjectMatrixX , rotateObjectMatrixZ ,applyTransformation, assembleArray } from "./utils.js";

const N_OF_CIRCLE_POINTS = 1000;
//This rod initial position will be defined as a reference point for the rod and will be used mainly to determine in the beggining
//how to translate the rod to the hands of the player, because after the first time, the reference point will be updated at each 
//game cycle. It will be used also to define the location of the handle's base of the rod to draw it the first time.
const ROD_INITIAL_POSITION = [0.9, 0.0,-0.8];
export const POND_RADIUS = 0.8;


const color = [[0.54, 0.27, 0.07],  //front, red
                [0.54, 0.27, 0.07],  //left, green
                [0.54, 0.27, 0.07], //back, blue
                [0.54, 0.27, 0.07],    //right, yellow
                [0.54, 0.27, 0.07],    //top , purple
                [0.54, 0.27, 0.07]];   //bottom, cyan

const color2 = [[0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87],
                [0.87, 0.87, 0.87]];

const colorFin = [[0.85, 0.65, 0.0],
                  [0.85, 0.65, 0.0],
                  [0.85, 0.65, 0.0],
                  [0.85, 0.65, 0.0],
                  [0.85, 0.65, 0.0],
                  [0.85, 0.65, 0.0]];

/*CUBE DATA*/
var cubePosition = setCubeVertices(0.3);
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
var rodColor = setCylinderColor([0.57, 1.0, 0.33], N_OF_CIRCLE_POINTS);
var rodMat = mat4.create();
mat4.translate(rodMat, rodMat, [0.0, -0.5, 0.0]);
rodPosition = applyTransformation(rodPosition, rodMat);

var rodReelPosition = setCylinderVertices( [ 0.95, 0.1,-0.6], [ 0.99, 0.1 ,-0.7], 0.1, N_OF_CIRCLE_POINTS);
var rodReelColor = setCylinderColor([0.57, 1.0, 0.33], N_OF_CIRCLE_POINTS);
var rodReelMat = rotateObjectMatrixY( rodReelPosition, degToRad(95), [0.95, -0.3,-0.6]);
rodReelPosition = applyTransformation(rodReelPosition, rodReelMat);

/* POND DATA*/
var pondPosition = setCircleVertices3d([0.5 ,0.5, -1.8], POND_RADIUS , N_OF_CIRCLE_POINTS);
var pondColor = setCircleColor(colors.blue, N_OF_CIRCLE_POINTS);

/* FISH DATA */
var fishPosition = setEllipsoidVertices(5, 8, 0.3, 0.1, 0.1);
var fishColor = setEllipsoidColor(colors.brownish, fishPosition.length);

var fishCaudialFin1Position = setRectangle3dVertices(0.08, 0.03, 0.01);
var fishCaudialFin1Color = setCubeColors(colorFin);

var fishCaudialFin2Position = setRectangle3dVertices(0.08, 0.03, 0.01);
var fishCaudialFin2Color = setCubeColors(colorFin);

var fishDorsalFinPosition = setRectangle3dVertices(0.06, 0.15, 0.01);
var fishDorsalFinColor = setCubeColors(colorFin);

var fishPectoralFin1Position = setRectangle3dVertices(0.06, 0.08, 0.01);
var fishPectoralFin1Color = setCubeColors(colorFin);

var fishPectoralFin2Position = setRectangle3dVertices(0.06, 0.08, 0.01);
var fishPectoralFin2Color = setCubeColors(colorFin);

// Adicionando olhos ao peixe
var fishEye1Position = setCircleVertices3d([0.0, 0.0, 0.0], 0.02, N_OF_CIRCLE_POINTS); // Olho esquerdo
var fishEye1Color = setCircleColor(colors.greenish, N_OF_CIRCLE_POINTS);

var fishEye2Position = setCircleVertices3d([0.0, 0.0, 0.0], 0.02, N_OF_CIRCLE_POINTS); // Olho direito
var fishEye2Color = setCircleColor(colors.greenish, N_OF_CIRCLE_POINTS);

/*GAME OBJECTS*/
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
var cubeMatrix = rotateObjectMatrixY(cube.getReferencePoint(),  degToRad(0) ,[-1.5, 0.0 ,0.0]);
cubePosition = applyTransformation(cubePosition, cubeMatrix);
cube.setPositionArray(cubePosition);
cube.setColorArray(cubeColor);
cube.setNormalArray(cubeNormal);

var pond = new GameObject();
pond.setReferencePoint([0.5 ,0.5, -1.8]);
var pondMatrix = rotateObjectMatrixX(pond.getReferencePoint(), degToRad(90) , [ 0.5 ,-0.45, -1.8]);
pond.setPositionArray(applyTransformation(pondPosition, pondMatrix));
pond.setColorArray(pondColor);

var fish = new GameObject();
fish.setReferencePoint([0.0, 0.0, 0.0]);

// Aplicar transformações para posicionar o corpo do peixe
var fishMatrix = rotateObjectMatrixY(fish.getReferencePoint(), degToRad(0), [0.8, 0.8, -1.0]);
fishPosition = applyTransformation(fishPosition, fishMatrix);

// Aplicar transformações para posicionar as barbatanas caudais
fishMatrix = rotateObjectMatrixZ(fish.getReferencePoint(), degToRad(-34), [0.54, 0.8, -1.0]);
fishCaudialFin1Position = applyTransformation(fishCaudialFin1Position, fishMatrix);
fishMatrix = rotateObjectMatrixZ(fish.getReferencePoint(), degToRad(34), [0.54, 0.8, -1.0]);
fishCaudialFin2Position = applyTransformation(fishCaudialFin2Position, fishMatrix);

// Aplicar transformações para posicionar a barbatana dorsal
fishMatrix = rotateObjectMatrixZ(fish.getReferencePoint(), degToRad(90), [0.77, 0.87, -1.0]);
fishDorsalFinPosition = applyTransformation(fishDorsalFinPosition, fishMatrix);

// Aplicar transformações para posicionar as barbatanas peitorais
fishMatrix = rotateObjectMatrixZ(fish.getReferencePoint(), degToRad(45), [0.81, 0.74, -1.05]);
fishPectoralFin1Position = applyTransformation(fishPectoralFin1Position, fishMatrix);
fishMatrix = rotateObjectMatrixZ(fish.getReferencePoint(), degToRad(-45), [0.81, 0.74, -0.95]);
fishPectoralFin2Position = applyTransformation(fishPectoralFin2Position, fishMatrix);

// Aplicar transformações para posicionar os olhos
fishMatrix = rotateObjectMatrixY(fish.getReferencePoint(), degToRad(-13), [0.97, 0.81, -1.09]);
fishEye1Position = applyTransformation(fishEye1Position, fishMatrix); // Olho esquerdo
fishMatrix = rotateObjectMatrixY(fish.getReferencePoint(), degToRad(13), [0.97, 0.81, -0.91]);
fishEye2Position = applyTransformation(fishEye2Position, fishMatrix); // Olho direito

// Montar o array de posições e cores para o peixe
fish.setReferencePoint([0.8, 0.8, -1.0]);
fish.setPositionArray(assembleArray([
    fishPosition,
    fishCaudialFin1Position,
    fishCaudialFin2Position,
    fishDorsalFinPosition,
    fishPectoralFin1Position,
    fishPectoralFin2Position,
    fishEye1Position, // Adicionando olho esquerdo
    fishEye2Position  // Adicionando olho direito
]));

fish.setColorArray(assembleArray([
    fishColor,
    fishCaudialFin1Color,
    fishCaudialFin2Color,
    fishDorsalFinColor,
    fishPectoralFin1Color,
    fishPectoralFin2Color,
    fishEye1Color, // Cor do olho esquerdo
    fishEye2Color  // Cor do olho direito
]));

export {landscape, cube, rod, pond, fish};