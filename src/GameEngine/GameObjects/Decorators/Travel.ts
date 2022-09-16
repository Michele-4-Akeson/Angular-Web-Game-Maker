import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

class Travel extends EntityDecorator{
    path:string
    range:number
    currentPoint:number = 0
    forwards:boolean = false
    speed:number
    constructor(gameEntity:GameEntity, path:string, range:number, speed:number){
        super(gameEntity)
        this.path = path
        this.range = range
        this.speed = speed
    }


    override update(): void {
        if (this.path == "horizontal"){
           this.moveHorizontal()
        } else{
            this.moveVertical()
        }

        super.update()
    }

    moveHorizontal(){
        if (this.forwards){
            if (!this.getBoxCollider()?.sideHasCollision("right") && this.currentPoint < this.range){
                this.getTransform().moveX(this.speed)
                this.currentPoint += this.speed
                this.goTo("right")
            } else {
                this.forwards = false
            }
        } else {
            if (!this.getBoxCollider()?.sideHasCollision("left") && this.currentPoint > 0){
                this.getTransform().moveX(-this.speed)
                this.currentPoint -= this.speed
                this.goTo("left")
            } else {
                this.forwards = true
            }
        }

    }


    moveVertical(){
        if (this.forwards){
            if (!this.getBoxCollider()?.sideHasCollision("down") && this.currentPoint < this.range){
                this.getTransform().moveY(this.speed)
                this.currentPoint += this.speed
                this.goTo("down")
            } else {
                this.forwards = false
            }
        } else {
            if (!this.getBoxCollider()?.sideHasCollision("up") && this.currentPoint > 0){
                this.getTransform().moveY(-this.speed)
                this.currentPoint -= this.speed
                this.goTo("up")
            } else {
                this.forwards = true
            }
        }

    }




} export default Travel