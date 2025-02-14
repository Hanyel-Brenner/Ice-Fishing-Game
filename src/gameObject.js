export class gameObject{

    referencePoint;
    positionArray;
    colorArray;
    normalArray;

    constructor(){}

    setReferencePoint(referencePoint){
        this.referencePoint = referencePoint
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