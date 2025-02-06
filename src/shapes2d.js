export function setCircleVertices(center, radius, numberOfPoints){
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

export function setCircleColor(color , numberOfPoints){
  var colorArray = [];  
  for(let i=0; i<numberOfPoints*3; i++){
    colorArray.push(color[0]);
    colorArray.push(color[1]);
    colorArray.push(color[2]); 
  }
  return colorArray;
}

export function setRectangleVertices(x,y,width, height){
  let x1 = x;
  let y1 = y;
  let x2 = x1 + width;
  let y2 = y1 + height;
  let vertexData = [];
  vertexData = [
      x1, y1, 0.0,
      x2, y1, 0.0,
      x1, y2, 0.0,  
      x1, y2, 0.0,
      x2, y1, 0.0,
      x2, y2, 0.0,
  ]

  return vertexData;
}

export function setRectangleColor(color){
  colorArray = [];

  for(let i=0; i<6; i++){
    colorArray.push(color[0]);
    colorArray.push(color[1]);
    colorArray.push(color[2]);  
  }
  return colorArray;
}