import { get3DViewingMatrix, getPerspectiveMatrix } from "./utils";

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
