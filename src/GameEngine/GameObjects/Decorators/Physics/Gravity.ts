import { max } from "rxjs";
import GameEntity from "../../../Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator";

/**
 * This class will move a gameEnity downwards every frame if the gameEntity isn't colliding with
 * any other enity
 */
class Gravity extends EntityDecorator{
    speed:number
    maxSpeed:number
    acceleration:number
    constructor(gameEntity:GameEntity, acceleration:number, maxSpeed:number){
        super(gameEntity)
        this.speed = 0
        this.maxSpeed = maxSpeed
        this.acceleration = acceleration
        this.setDynmaic(true)
    }


    override update(): void {
        if (!this.onGround()){
            this.speed += this.acceleration
            if (Math.abs(this.speed) >= Math.abs(this.maxSpeed)){
                this.speed = this.maxSpeed
            }
           
            this.gameEntity.getTransform().moveY(this.speed)
        }
        super.update()
    }


    onGround():boolean{
        if(!this.gameEntity.getBoxCollider()?.collisionData.bottom){
            return false
        } else {
            this.speed = 0
            return true
        }
    }

} export default Gravity