export function generateShader(gl,shaderType,shaderSource){
  var shaderTypeStr; 
  if(shaderType == gl.VERTEX_SHADER) shaderTypeStr == 'VERTEX_SHADER';
  if(shaderType == gl.FRAGMENT_SHADER) shaderTypeStr == 'FRAGMENT_SHADER';
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader,shaderSource);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    throw new Error(`Failed to compile shader with source : ${shaderSource}\nLOG : ${gl.getShaderInfoLog(shader, gl.COMPILE_STATUS)}`);
  }
  return shader;
}

export function generateProgram(gl, vertexShader, fragmentShader){
  var program = gl.createProgram();
  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);
  gl.linkProgram(program);

  if(gl.getProgramParameter(program, gl.LINK_STATUS)) {return program;}
  
  gl.deleteProgram(program);
  throw new error(`Failed to generate or link shader program\nLOG : ${gl.getProgramInfoLog(program,gl.LINK_STATUS)}`);
  
}