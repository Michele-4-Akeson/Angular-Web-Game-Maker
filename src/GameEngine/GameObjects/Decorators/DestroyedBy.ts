import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

class DestroyedBy extends EntityDecorator{
    dangerTag:string
    constructor(gameEntity:GameEntity, tag:string){
        super(gameEntity)
        this.dangerTag = tag
        
    }





    override collisionEvent(gameObject: GameEntity): void {
        if (gameObject.getTag() == this.dangerTag){
            this.setActive(false)
            super.setActive(false)
        }
    }
} export default DestroyedBy