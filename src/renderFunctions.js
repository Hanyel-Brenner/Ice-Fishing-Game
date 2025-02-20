export function renderObject(gl, positionBuffer, colorBuffer, normalBuffer, vertices, color, normal){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    if(normal != null){
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    }
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3); // Corrigido para vertices.length / 3
}
export function renderSquare(gl, positionBuffer, colorBuffer, rectangleData, rectangleColor){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, rectangleData[0], rectangleData[1], rectangleData[2], rectangleData[3]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, rectangleColor[0], rectangleColor[1], rectangleColor[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function renderCircle(gl, positionBuffer, colorBuffer, circleData, circleColor, nOfPoints){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, circleData[0], circleData[1], circleData[2], nOfPoints);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, circleColor[0], circleColor[1], circleColor[2], nOfPoints);
    gl.drawArrays(gl.TRIANGLES, 0, nOfPoints * 6);
}

export function renderCube(gl, positionBuffer, colorBuffer, normalBuffer, vertices, color, normal){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    if(normal != null){
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.BufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    }
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length*6);
}

export function renderCylinder(gl, positionBuffer, colorBuffer, normalBuffer, vertices, color, normal){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.BufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length*6);
}

