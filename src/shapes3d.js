import {setCircleVertices, setCircleColor} from './shapes2d.js';

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

export function setCircleVertices3d(center, radius, numberOfPoints){
    var angle = (2 * Math.PI)/numberOfPoints;
    var xc = center[0], yc = center[1], zc = center[2];
    var vertices = [];
    
    for(let i=0; i<numberOfPoints; i++){
      var x = radius * Math.cos(angle*i) + xc;
      var y = radius * Math.sin(angle*i) + yc;
      var z = zc;
      var x2 = radius * Math.cos(angle*(i+1)) + xc;
      var y2 = radius * Math.sin(angle*(i+1)) + yc;
      var z2 = zc;
      
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);
      vertices.push(x2);
      vertices.push(y2);
      vertices.push(z2);
      vertices.push(0.0 + xc);
      vertices.push(0.0 + yc);
      vertices.push(0.0 + zc); 
    }
    return vertices;
  }

export function setEllipsoidVertices(a, b ,c, latitudeDivisions, longitudeDivisions){
  // Generate ellipsoid vertices
  let vertices = [];
  for (let i = 0; i <= latitudeDivisions; i++) {
    let u = i * Math.PI / latitudeDivisions;  // Latitude angle (0 to pi)
    for (let j = 0; j <= longitudeDivisions; j++) {
      let v = j * 2 * Math.PI / longitudeDivisions;  // Longitude angle (0 to 2pi)
      
      let x = a * Math.sin(u) * Math.cos(v);
      let y = b * Math.sin(u) * Math.sin(v);
      let z = c * Math.cos(u);
      
      vertices.push(x, y, z);
    }
  }
  return vertices;
}

export function setEllipsoidColor(color, vertexArrayLength){
    color = [];
    for(let i=0; i<vertexArrayLength/3; i++){
        color.push(color[0], color[1], color[2]);
    }
    return color;
}