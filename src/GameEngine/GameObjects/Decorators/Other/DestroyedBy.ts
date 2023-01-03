import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator";

class DestroyedBy extends EntityDecorator{
    dangerTag:string
    constructor(gameEntity:GameEntity, tag:string){
        super(gameEntity)
        this.dangerTag = tag
        this.setDynmaic(true)
        
    }





    override collisionEvent(gameObject: GameEntity): void {
        super.collisionEvent(gameObject)
        if (gameObject.getTag() == this.dangerTag){
            this.setActive(false)
        }

    }
} export default DestroyedBy