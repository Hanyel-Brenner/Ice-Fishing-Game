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