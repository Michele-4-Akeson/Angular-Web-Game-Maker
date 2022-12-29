import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator";

class AttachEntity extends EntityDecorator{
    child:GameEntity
    bound:boolean
    constructor(gameEntity:GameEntity, child:GameEntity, bound:boolean, xOffset:number, yOffset:number){
        super(gameEntity)
        this.child = child
        this.bound = bound
        this.addChild(child)
        this.applyOffset(xOffset, yOffset)
        child.setDynmaic(true)
    }




    override update(): void {
        if (this.bound){
            this.followParent()
        }

        
        this.child.update()
        let positionX = this.child.getTransform().getPositionX()
        let positionY = this.child.getTransform().getPositionY()
        this.child.getBoxCollider()?.update(positionX, positionY)
        
        super.update()
    }


    followParent(){
        let parentPositionX = this.gameEntity.getTransform().getPositionX()
        let parentPositionY = this.gameEntity.getTransform().getPositionY()
        this.child.updatePosition(parentPositionX, parentPositionY)
    }


    applyOffset(x:number, y:number){
        this.child.getTransform().setX(x)
        this.child.getTransform().setY(y)
    }
} export default AttachEntity