export class GameObject{

    referencePoint;
    referenceDirection;
    positionArray;
    colorArray;
    normalArray;

    constructor(){}

    setReferencePoint(referencePoint){
        this.referencePoint = referencePoint
    }

    setReferenceDirection(referenceDirection){
        this.referenceDirection = referenceDirection;
    }

    setPositionArray(positionArray){
        this.positionArray = positionArray;
    }

    setColorArray(colorArray){
        this.colorArray = colorArray
    }

    setNormalArray(normalArray){
        this.normalArray = this.normalArray;
    }

    getReferencePoint(){
        return this.referencePoint;
    }

    getReferenceDirection(){
        return this.referenceDirection;
    }

    getPositionArray(){
        return this.positionArray;
    }

    getColorArray(){
        return this.colorArray;
    }

    getNormalArray(){
        return this.normalArray;
    }
}