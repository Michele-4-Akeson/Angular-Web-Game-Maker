import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import AttachEntity from "./AttachEntity";

class ShowChild extends AttachEntity{
    constructor(gameEntity:GameEntity, child:GameEntity, bound:boolean, x:number, y:number){
        super(gameEntity, child, bound, x, y)
        child.setActive(false)

    }



    override update(): void {
        if (this.gameEntity.getBoxCollider()?.collisionData.gameObject){
            this.child.setActive(true)
            this.child.update()
        } else {
            this.child.setActive(false)
            super.update()
        }
    }
} export default ShowChild