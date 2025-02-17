export function degToRad(d) {
    return d * Math.PI / 180;
}

export function radToDeg(ang){
    return ang * 180 / Math.PI;
}

export function unitVector(v){
    let size = Math.sqrt(Math.pow(v[0],2) +  Math.pow(v[1],2) + Math.pow( v[2], 2));
    return [ v[0]/size, v[1]/size , v[2]/size ];
}

export function perpendicularVectorClockwise(vec2){
    return [-vec2[1], vec2[0]];
}

export function perpendicularVectorCounterClockwise(vec2){
    return [-vec2[1], vec2[0]];
}

function get2DViewingMatrix(point, angle){
    var x = point[0];
    var y = point[1];
    var ang = degToRad(angle);
    var matrix = mat4.create();
    mat4.rotateZ(matrix, matrix , ang);
    mat4.translate(matrix, matrix, [-x, -y, 0.0]);
    return matrix;
}

function get2DWindowToViewportMatrix(xw_min, xw_max, yw_min, yw_max){
    var matrix = mat4.create();
    var sx = 2/(xw_max - xw_min);
    var sy = 2/(yw_max - yw_min);
    mat4.translate(matrix, matrix, [-1.0, -1.0, 0.0]);
    mat4.scale(matrix, matrix, [sx, sy, 1.0]);
    mat4.translate(matrix, matrix,  [-xw_min , -yw_min ,0.0]);
    return matrix;
}

/* 
* p0 is the camera position, pRef is the reference point to determine the direction that the camera is pointing and V the y-view axis positive
* direction
* pRef is commonly pointing to the origin of world coordinate system and V is generally set to (0,1,0), however this is not
* the y-view value, it will be adjusted based on V.
*/
export function get3DViewingMatrix(p0, pRef, V){
    var matrix = [];
    var N = [p0[0] - pRef[0] , p0[1] - pRef[1] , p0[2] - pRef[2]];
    var n = unitVector(N);
    var U = []; 
    vec3.cross(U, V, n);
    var u = unitVector(U);
    var v = [];
    vec3.cross(v, n, u);
    //we have the unv coordinate system
    var T = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -p0[0], -p0[1], -p0[2], 1,
      ];
    var R = [
        u[0], v[0], n[0],  0,
        u[1], v[1], n[1],  0,
        u[2], v[2], n[2],  0,
           0,    0,    0,  1,
      ];

    mat4.multiply(matrix, R, T);
    return matrix;
}

export function getOrtographicMatrix(xw_min, xw_max, yw_min, yw_max, z_far, z_near){    
    let matrix = [
        2/(xw_max-xw_min), 0, 0, 0,
        0, 2/(yw_max-yw_min), 0, 0,
        0, 0, -2/(z_near-z_far), 0,
        -(xw_max+xw_min)/(xw_max-xw_min), -(yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), 1,
      ];
      return matrix;
}

export function getPerspectiveMatrix(xw_min,xw_max,yw_min,yw_max,z_near,z_far){
    let matrix = [
      -(2*z_near)/(xw_max-xw_min), 0, 0, 0,
      0, -(2*z_near)/(yw_max-yw_min), 0, 0,
      (xw_max+xw_min)/(xw_max-xw_min), (yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), -1,
      0, 0, -1, 0,
    ];
    return matrix;
}

export function getFinalMatrix(p0, pRef, V, xw_min, xw_max, yw_min, yw_max, z_near, z_far){
    var cameraMatrix = mat4.create();
    var persMatrix = mat4.create();
    var lookAt = mat4.create();
    var model = mat4.create();
    var matrix = mat4.create();
    cameraMatrix = get3DViewingMatrix(p0, pRef, V);
    persMatrix = getPerspectiveMatrix(xw_min, xw_max, yw_min, yw_max, z_near, z_far);
    mat4.multiply(lookAt, persMatrix, cameraMatrix);
    mat4.multiply(matrix, lookAt, model);
    return matrix
}

export function assembleArray( arrays){
    var array = []
    var n = arrays.length;
    for(let i = 0; i < n; i++){
        array = array.concat(arrays[i])
    }
    return array; 
}

export function trackRod(cameraDir, rodDir, rod, p0){
    var ang_camera_x;
    var ang_rod_x;
    var angle;
    var rodMatrix = mat4.create();

    if(cameraDir[2] < 0){
        ang_camera_x = vec3.angle(cameraDir,[1.0, 0.0, 0.0]); 
    }
    else{
        ang_camera_x = degToRad(360) - vec3.angle(cameraDir,[1.0, 0.0, 0.0]); 
    }
    if(rodDir[2] < 0){
        ang_rod_x = vec3.angle(rodDir,[1.0, 0.0, 0.0]); 
    }
    else{
        ang_rod_x = degToRad(360) - vec3.angle(rodDir,[1.0, 0.0, 0.0]); 
    }

    var alpha = 0.5;
    var theta = 0.5;
    var point1 = [ p0[0] + (alpha * cameraDir[0]), p0[1] + (alpha * cameraDir[1]), p0[2] + (alpha * cameraDir[2])];
    var perpVector = perpendicularVectorClockwise([cameraDir[0], cameraDir[2]]);
    var x = perpVector[0];
    var z = perpVector[1];
    var vector = [x, cameraDir[1] ,z];
    var point2 = [point1[0] + (theta * vector[0]), point1[1] + (theta * vector[1]) , point1[2] + (theta * vector[2])];

    angle = ang_camera_x - ang_rod_x;
    rodMatrix = mat4.create();
    //mat4.translate(rodMatrix, rodMatrix, pRef);
    mat4.translate(rodMatrix, rodMatrix, point2);

    mat4.rotateY(rodMatrix, rodMatrix, angle);
    var temp = rod.getReferencePoint();
    mat4.translate(rodMatrix, rodMatrix, [-temp[0], -temp[1], -temp[2]]);
    rod.setPositionArray(applyTransformation(rod.getPositionArray(), rodMatrix));
    rod.setReferenceDirection(cameraDir);
    //rod.setReferencePoint(pRef);
    rod.setReferencePoint(point2);
}

export function isInsidePond(point, referencePoint, radius){
    var cx = referencePoint[0];
    var cz = referencePoint[2];
    var x = point[0];
    var z = point[2];
    if(Math.sqrt(Math.pow(x - cx, 2) + Math.pow(z - cz, 2)) <= radius){
        return true;
    }
    return false;
}

export function rotateObjectMatrixY(object, rotationAngle, translation2){
    var translation = [ -object[0], -object[1], -object[2]]
    var matrix = mat4.create();
    mat4.translate(matrix, matrix,translation2);
    mat4.rotateY(matrix, matrix,rotationAngle);
    mat4.translate(matrix, matrix, translation);
    return matrix;
}

export function rotateObjectMatrixX(object, rotationAngle, translation2){
    var translation = [ -object[0], -object[1], -object[2]]
    var matrix = mat4.create();
    mat4.translate(matrix, matrix,translation2);
    mat4.rotateX(matrix, matrix,rotationAngle);
    mat4.translate(matrix, matrix, translation);
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