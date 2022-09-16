import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

class Speed extends EntityDecorator{
    direction:string
    speed:number
    constructor(gameEntity:GameEntity, direction:string, speed:number){
        super(gameEntity)
        this.direction = direction
        this.speed = speed

    }

    override update(): void {
        switch(this.direction){
            
            case "left":
                if (!this.getBoxCollider()?.sideHasCollision(this.direction)){
                    this.getTransform().moveX(this.speed)
                }
             
                break
            case "right":
                if (!this.getBoxCollider()?.sideHasCollision(this.direction)){
                    this.getTransform().moveX(this.speed)
                }
                break
            case "up":
                if (!this.getBoxCollider()?.sideHasCollision(this.direction)){
                    this.getTransform().moveY(this.speed)
                }
             
                break
            case "down":
                if (!this.getBoxCollider()?.sideHasCollision(this.direction)){
                    this.getTransform().moveY(this.speed)
                }
             
                break

        }

        this.goTo(this.direction)
        super.update()
    }




} export default Speed