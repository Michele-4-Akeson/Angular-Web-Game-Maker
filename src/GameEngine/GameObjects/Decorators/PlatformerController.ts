import Input from "src/GameEngine/GameComponents/Input";
import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import EntityDecorator from "./EnityDecorator";
import InputUser from "./InputUser";

class PlatformerController extends InputUser{
    jumpForce:number = 0
    jumpTime:number = 0
    isJumping:boolean = false
    jumpTimeLeft:number = 0
    speed:number = 0
    constructor(gameEntity : GameEntity, jumpForce:number, jumpTime:number, speed:number, subject:Subject){
        super(gameEntity, subject)
        this.jumpForce = jumpForce
        this.jumpTime = jumpTime
        this.speed = speed
    }

    override update(): void {

        this.jump()

        if (this.isStopped()){
            this.goTo("stop")
        } else {
            if (this.input.isKeyDown("ArrowRight") && !this.input.isKeyDown("ArrowLeft") ) {
                if (!this.getBoxCollider()?.sideHasCollision("right")) {
                    this.getTransform().moveX(this.speed)
                    this.goTo("right")
                } 
            } 
            
            if (this.input.isKeyDown("ArrowLeft") && !this.input.isKeyDown("ArrowRight")) {
                if (!this.getBoxCollider()?.sideHasCollision("left")) {
                    this.getTransform().moveX(-this.speed)
                    this.goTo("left")
                } 
            } 
            

        }

        if (this.isJumping){
            if (this.jumpTimeLeft > 0){
                this.getTransform().moveY(-this.jumpForce)
                this.jumpTimeLeft -= 0.01
            } else {
                this.isJumping = false
            }
        }


      


        super.update()


        
    }



    jump(){
        if (this.onGround() && this.input.isKeyDown("ArrowUp")){
            this.isJumping = true
            this.jumpTimeLeft = this.jumpTime
        }

    }

    isStopped(){
        return !(this.input.isKeyDown("ArrowLeft") || this.input.isKeyDown("ArrowRight"))
    }


    onGround(){
        if (this.getBoxCollider()?.sideHasCollision("down")){
            return true
        }

        return false

    }
} export default PlatformerController