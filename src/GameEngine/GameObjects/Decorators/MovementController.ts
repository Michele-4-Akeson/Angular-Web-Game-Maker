import Input from "src/GameEngine/GameComponents/Input";
import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import EntityDecorator from "./EnityDecorator";
import InputUser from "./InputUser";

class MovementController extends InputUser{
    speed:number = 0
    constructor(gameEntity:GameEntity, speed:number, subject:Subject){
        super(gameEntity, subject)
        this.speed = speed
    }



    override update(): void {

        if (this.isStopped()){
            this.goTo("stop")
            
        } else {
            if (this.input.isKeyDown("ArrowRight") && !this.input.isKeyDown("ArrowLeft") ) {
                if (!this.getBoxCollider()?.sideHasCollision("right")) {
                    this.goTo("right")
                    this.getTransform().moveX(this.speed)
                }
            } 
            
            if (this.input.isKeyDown("ArrowLeft") && !this.input.isKeyDown("ArrowRight")) {
                this.goTo("left")
                if (!this.getBoxCollider()?.sideHasCollision("left")) this.getTransform().moveX(-this.speed)
            }
    
    
            if (this.input.isKeyDown("ArrowUp") && !this.input.isKeyDown("ArrowDown")){
                this.goTo("up")
                if (!this.getBoxCollider()?.sideHasCollision("up"))this.getTransform().moveY(-this.speed)
            }
    
            if (!this.input.isKeyDown("ArrowUp") && this.input.isKeyDown("ArrowDown")){
                this.goTo("down")
                if (!this.getBoxCollider()?.sideHasCollision("down")) this.getTransform().moveY(this.speed)
            }
    

        }
        
        console.log("M UPDATE")
        super.update()
    }


    isStopped(){
        return !(this.input.isKeyDown("ArrowRight") || this.input.isKeyDown("ArrowLeft")  ||
                this.input.isKeyDown("ArrowUp") || this.input.isKeyDown("ArrowDown")) 
    }

} export default MovementController