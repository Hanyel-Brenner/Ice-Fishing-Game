export var gameState = {
    isRunning : false,
    isFishing : false,
    fishQuantity : 0,
    fishingProgress : 0,
    time : 0
}

export function setIsRunning(valor){
    gameState.isRunning = valor
}

export function setIsFishing(valor){
    gameState.isFishing = valor
}

export function setFishingProgress(valor){
    gameState.fishingProgress = valor;
}

export function incrementFishingProgress(valor){
    gameState.fishingProgress += valor;
}

export function setTime(){
    setInterval( () => {gameState.time += 1}, 1000)
}

export function incrementFishQuantity(){
    gameState.fishQuantity += 1;
}

export function getIsRunning(){
    return gameState.isRunning;
}

export function getIsFishing(){
    return gameState.isFishing;
}

export function getFishQuantity(){
    return gameState.fishQuantity;
}

export function getFishingProgress(){
    return gameState.fishingProgress;
}

export function getTime(){
    return gameState.time
}