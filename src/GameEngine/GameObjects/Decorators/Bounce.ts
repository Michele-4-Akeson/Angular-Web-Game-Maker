import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

interface BounceDirection{
    time:number,
    direction:string
}

class Bounce extends EntityDecorator{
    bouncePower:number = 0
    bounceTime:number = 0
    horizontalBounce:BounceDirection
    verticalBounce:BounceDirection
    constructor(gameEntity:GameEntity, bouncePower:number, bounceTime:number){
        super(gameEntity)
        this.bouncePower = bouncePower
        this.bounceTime = bounceTime
        this.horizontalBounce = {time:0, direction:"none"}
        this.verticalBounce = {time:0, direction:"none"}


    }

    override update(): void {
        // on collision right - override horizontal bounce set bounce direction to right and start timer -- continue bounce until time is exceeded
        if (this.getBoxCollider()?.sideHasCollision("left")){
            this.setBounce(this.horizontalBounce, "right")   
        } else if (this.getBoxCollider()?.sideHasCollision("right")){
            this.setBounce(this.horizontalBounce, "left")   
        } 

        if (this.getBoxCollider()?.sideHasCollision("up")){
            this.setBounce(this.verticalBounce, "down")   
        } else if (this.getBoxCollider()?.sideHasCollision("down")){
            this.setBounce(this.verticalBounce, "up")   
        } 


        if (this.horizontalBounce.time > 0){
            if (this.horizontalBounce.direction == "left") this.getTransform().moveX(-this.bouncePower)
            else this.getTransform().moveX(this.bouncePower)
            this.horizontalBounce.time -= 0.01
        } else {
            this.horizontalBounce.direction = "none"
        }


        if (this.verticalBounce.time > 0){
            if (this.verticalBounce.direction == "up") this.getTransform().moveY(-this.bouncePower)
            else this.getTransform().moveY(this.bouncePower)
            this.verticalBounce.time -= 0.01
        } else {
            this.verticalBounce.direction = "none"
        }

        super.update()

        
    }


    setBounce(bounce:BounceDirection, direction:string){
        bounce.direction = direction
        bounce.time = this.bounceTime

    }
} export default Bounce