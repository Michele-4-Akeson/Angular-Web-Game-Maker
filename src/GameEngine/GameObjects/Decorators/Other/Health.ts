import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator";

class Health extends EntityDecorator{
    health:number
    damage:number
    byTag:string
    canBeHurt:boolean = true
    delay:number = 1
    hurtFrame:number
    constructor(gameEntity:GameEntity, health:number, damage:number, byTag:string, hurtFrame:number){
        super(gameEntity)
        this.health = health
        this.damage = damage
        this.byTag = byTag
        this.hurtFrame = hurtFrame

    }



    override collisionEvent(gameObject: GameEntity): void {
        if (gameObject.getTag() == this.byTag){
            if (this.canBeHurt){
                this.canBeHurt = false
                this.health -= this.damage

                if (this.hurtFrame >= 0) this.getAnimation()?.startTriggeredAnimation(this.hurtFrame)

                if (this.health <= 0){
                    this.setActive(false)
                }

                setTimeout(()=>{
                    this.canBeHurt = true
                }, this.delay * 1000)


            }
           
        }
    }

    
} export default Health