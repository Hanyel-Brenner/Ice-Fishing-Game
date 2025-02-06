export var keysPressed = {} 
export var mouseEventCounter = 0;
export var mouseDirection = [0.0 , 0.0];

export function keyboardPressDown(event){
    keysPressed[event.keyCode] = true;
  }
  
export function keyboardPressUp(event){
    keysPressed[event.keyCode] = false
  }
  
export function mouseTrack(event, canvas){
    let x = -1.0 + (2*(event.offsetX/canvas.width));
    let y = 1.0 - (2*(event.offsetY/canvas.height)); 
    var mousePos1 = [0.0, 0.0];
    var mousePos2 = [0.0, 0.0];
  
    if(!(x > 1 || x < -1 || y > 1 || y < -1)) {
      
      if(mouseEventCounter % 2 == 0){
        mousePos1 = [x, y];
      }
      else{
        mousePos2 = [x, y];
        mouseDirection = [mousePos2[0] - mousePos1[0], mousePos2[1] - mousePos1[1]];
      }
      
      mouseEventCounter++;
    }
  }
