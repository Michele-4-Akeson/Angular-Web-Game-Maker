import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

class Health extends EntityDecorator{
    health:number
    damage:number
    byTag:string
    constructor(gameEntity:GameEntity, health:number, damage:number, byTag:string){
        super(gameEntity)
        this.health = health
        this.damage = damage
        this.byTag = byTag

    }



    override collisionEvent(gameObject: GameEntity): void {
        if (gameObject.getTag() == this.byTag){
            this.health -= this.damage

            if (this.health <= 0){
                this.setActive(false)
            }
        }
    }
} export default Health