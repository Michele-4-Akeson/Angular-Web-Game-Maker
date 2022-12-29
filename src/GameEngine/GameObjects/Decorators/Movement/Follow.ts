import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator"

class Follow extends EntityDecorator{
    followTag:string
    speed:number
    constructor(gameEntity:GameEntity, tag:string, speed:number){
        super(gameEntity)
        this.followTag = tag
        this.speed = speed
        this.setDynmaic(true)
    
    }


    override update(): void {
        console.log(this.getBoxTrigger()?.collisionData)
        if (this.isFollowing()){
            this.track(this.getTarget())
        } else {
            this.goTo("stop")
        }

        super.update()
        
    }



    isFollowing(){
        if (this.getBoxTrigger()?.collisionData.gameObject?.getTag() == this.followTag){
            return true
        }

        return false
    }

    getTarget():GameEntity{
        return this.getBoxTrigger()?.collisionData.gameObject!
    }

    track(target:GameEntity){
        let positionX = this.getTransform().getPositionX()
        let positionY = this.getTransform().getPositionY()

        let targetX = target.getTransform().getPositionX()
        let targetY = target.getTransform().getPositionY()

        let hDirection = "stop"
        let vDirection = "stop"

        if (positionX < targetX){
            if (!this.getBoxCollider()?.sideHasCollision("right")) {
                this.getTransform().moveX(this.speed) // move right
                hDirection = "right"
            } else {
                hDirection = "stop"
            }
            
           
        } else {
            if (!this.getBoxCollider()?.sideHasCollision("left")) {
                this.getTransform().moveX(-this.speed) // move left
                hDirection = "left"
            } else {
                hDirection = "stop"
                
            }

        }


        if (positionY < targetY){
            if (!this.getBoxCollider()?.sideHasCollision("down")) {
                this.getTransform().moveY(this.speed) // move down
                vDirection = "down"
            } else {
                vDirection = "stop"
            }
           
        } else {
            if (!this.getBoxCollider()?.sideHasCollision("up")) {
                this.getTransform().moveY(-this.speed) // move up
                vDirection = "up"
            } else {
                vDirection = "stop"
            }

        }



        if (Math.abs(positionX - targetX) > Math.abs(positionY - targetY)){
            this.goTo(hDirection)
        } else {
            this.goTo(vDirection)
        }

    }

} export default Follow