/**
 * @property {number} x an integer repersenting the pixel x coordinate of the object from it's xref position on the canvas -- allows for movement
 * @property {number} y an integer repersenting the pixel y coordinate of the object from it's yref position on the canvas -- allows for movement
 * @property {number} xref an integer repersenting the pixel x coordinate of the object on a canvas
 * @property {number} yref an integer repersenting the pixel y coordinate of the object on a canvas
 */
class Transform {
    private xref:number
    private yref:number
    private x:number
    private y:number
    private size:number
    constructor(xref : number, yref: number, size:number){
        this.xref = xref
        this.yref = yref
        this.x = 0
        this.y = 0
        this.size = size

    }

    setRef(xref:number, yref:number){
        this.xref = xref
        this.yref = yref
    }


    setX(x:number){
        this.x = x
    }

    setY(y:number){
        this.y = y
    }

    setSize(size:number){
        this.size = size
    }

    moveX(x:number){
        this.x += x
    }

    moveY(y:number){
        this.y += y
    }

    move(x:number, y:number){
        this.x += x
        this.y += y
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }

    getXref(){
        return this.xref
    }

    getYref(){
        return this.yref
    }

    getSize(){
        return this.size
    }


    getPositionX(){
        return this.x + this.xref
    }
    getPositionY(){
        return this.y + this.yref
    }

  


} export default Transform