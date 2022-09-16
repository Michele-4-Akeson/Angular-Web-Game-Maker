import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "./EnityDecorator";

class AttachEntity extends EntityDecorator{
    child:GameEntity
    bound:boolean
    constructor(gameEntity:GameEntity, child:GameEntity, bound:boolean, xOffset:number, yOffset:number){
        super(gameEntity)
        this.child = child
        this.bound = bound
        this.addChild(child)

        this.applyOffset(xOffset, yOffset)
    }




    override update(): void {
        if (this.bound){
            this.followParent()
        }

        
        this.child.update()
        super.update()
    }


    followParent(){
        let parentPositionX = this.gameEntity.getTransform().getPositionX()
        let parentPositionY = this.gameEntity.getTransform().getPositionY()
        this.child.getTransform().setRef(parentPositionX, parentPositionY)
    }



    applyOffset(x:number, y:number){
        this.child.getTransform().setX(x)
        this.child.getTransform().setY(y)
    }
} export default AttachEntity