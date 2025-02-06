import {setCircleVertices, setCircleColor} from './shapes2d.js';

export function createMatrix(translation, rotation, translation2){
    var matrix = mat4.create();
    mat4.translate(matrix, matrix,translation2);
    switch(rotation.type){
        case 'x':
            mat4.rotateX(matrix, matrix,rotation.angle);
            break;
        case 'y':
            mat4.rotateY(matrix, matrix,rotation.angle);
            break;
        case 'z':
            mat4.rotateZ(matrix, matrix,rotation.angle);
            break;
    }
    mat4.translate(matrix, matrix,translation);
    return matrix;
}

export function applyTransformation(object, transfMatrix){
    var len = object.length;
    var newObject = [];
    var oldVertex = [];
    var newVertex = [];
    for(let i=0; i < len; i += 3){
        oldVertex[0] = object[i];
        oldVertex[1] = object[i+1];
        oldVertex[2] = object[i+2];
        vec3.transformMat4(newVertex, oldVertex ,transfMatrix);
        newObject.push(newVertex[0], newVertex[1], newVertex[2]);
    }
    return newObject;
}

export function setLandscapeVertices( len, h){
    const vertexData = [
        // Front
        len, h, len,
        len, -h, len,
        -len, h, len,
        -len, h, len,
        len, -h, len,
        -len, -h, len,
    
        // Left
        -len, h, len,
        -len, -h, len,
        -len, h, -len,
        -len, h, -len,
        -len, -h,len,
        -len, -h, -len,
    
        // Back
        -len, h, -len,
        -len, -h, -len,
        len, h, -len,
        len, h, -len,
        -len, -h, -len,
        len, -h, -len,
    
        // Right
        len, h, -len,
        len, -h, -len,
        len, h, len,
        len, h, len,
        len, -h, len,
        len, -h, -len,
    
        // Top
        len, h, len,
        len, h, -len,
        -len, h, len,
        -len, h, len,
        len, h, -len,
        -len, h, -len,
    
        // Bottom
        len, -h, len,
        len, -h, -len,
        -len, -h, len,
        -len, -h, len,
        len, -h, -len,
        -len, -h, -len,
      ];
      return vertexData;
}


export function setCubeVertices(n){
    const vertexData = [
        // Front
        n, n, n,
        n, -n, n,
        -n, n, n,
        -n, n, n,
        n, -n, n,
        -n, -n, n,
    
        // Left
        -n, n, n,
        -n, -n, n,
        -n, n, -n,
        -n, n, -n,
        -n, -n, n,
        -n, -n, -n,
    
        // Back
        -n, n, -n,
        -n, -n, -n,
        n, n, -n,
        n, n, -n,
        -n, -n, -n,
        n, -n, -n,
    
        // Right
        n, n, -n,
        n, -n, -n,
        n, n, n,
        n, n, n,
        n, -n, n,
        n, -n, -n,
    
        // Top
        n, n, n,
        n, n, -n,
        -n, n, n,
        -n, n, n,
        n, n, -n,
        -n, n, -n,
    
        // Bottom
        n, -n, n,
        n, -n, -n,
        -n, -n, n,
        -n, -n, n,
        n, -n, -n,
        -n, -n, -n,
      ];
      return vertexData;
}

/* 
* You input 6 colors, one for each face
* The colors should be inputed in the order of the face that is closest to the z = 0 plane,
* then you specify in counter-clock wise the other faces, finishing with top and bottom
*/
export function setCubeColors(colors){
    var colorData = [];
    for(let i=0; i < 6; i++){
        for(let j=0; j < 6; j++){
            colorData = [...colorData, colors[i][0], colors[i][1], colors[i][2]];
        }
    }
    return colorData;
}

export function setCubeNormals(){
    var normals = [
        //front
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        //left
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        //back
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        //right
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        //top
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        //bottom
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0
    ];

    return normals;

}

export function setCylinderVertices(circle1, circle2, radius, nOfCirclePoints){
    var angle = 0;
    var angleVariation = 2*Math.PI/nOfCirclePoints;
    var x1 = circle1[0], y1 = circle1[1], z1 = circle1[2], x2 = circle2[0], y2 = circle2[1], z2 = circle2[2];
    var circle1Points = [];
    var circle2Points = [];
    var vertexArray = [];
    var x, y, z;

    for(let i = 0; i < nOfCirclePoints; i++){
        x = radius * Math.cos(angle) + x1;
        y = radius * Math.sin(angle) + y1;
        z = z1;
        circle1Points.push([x,y,z]);
        angle += angleVariation;
    }

    angle = 0;
    
    for(let j = 0; j < nOfCirclePoints; j++){
        x = radius * Math.cos(angle) + x2;
        y = radius * Math.sin(angle) + y2;
        z = z2;
        circle2Points.push([x, y, z]);
        angle += angleVariation;
    }

    for(var k = 0; k < nOfCirclePoints - 1; k++){
        vertexArray.push(circle1Points[k]);
        vertexArray.push(circle2Points[k]);
        vertexArray.push(circle2Points[k+1]);
        vertexArray.push(circle1Points[k+1]);
        vertexArray.push(circle1Points[k]);
        vertexArray.push(circle2Points[k+1]);
    } 
        vertexArray.push(circle1Points[circle1Points.length - 1]);
        vertexArray.push(circle2Points[circle2Points.length - 1]);
        vertexArray.push(circle2Points[0]);
        vertexArray.push(circle1Points[0]);
        vertexArray.push(circle1Points[circle1Points.length - 1]);
        vertexArray.push(circle2Points[0]);
        
    var formatedVertexArray = [];

    for(let i = 0; i < vertexArray.length; i++ ){
        formatedVertexArray.push(vertexArray[i][0]);
        formatedVertexArray.push(vertexArray[i][1]);
        formatedVertexArray.push(vertexArray[i][2]);
    }
    
    var circleCap1 = setCircleVertices(circle1, radius, nOfCirclePoints);
    var circleCap2 = setCircleVertices(circle2, radius, nOfCirclePoints);

    for(let i =0 ; i<circleCap1.length; i++){
        formatedVertexArray.push(circleCap1[i]);
    }
    for(let i=0; i<circleCap2.length; i++){
        formatedVertexArray.push(circleCap2[i]);
    }
    return formatedVertexArray;
}

export function setCylinderColor(color, nOfCirclePoints){
    var colorArray = [];
    for(var i = 0; i < nOfCirclePoints*6; i++){
        colorArray.push(color[0]);
        colorArray.push(color[1]);
        colorArray.push(color[2]);
    }
    var circleCapColor = setCircleColor(color, nOfCirclePoints);
    for(let j=0; j<circleCapColor.length; j++){
        colorArray.push(circleCapColor[i]);
        colorArray.push(circleCapColor[i]);
    }
    
    return colorArray;
}