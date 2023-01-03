import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import InputUser from "../InputUser";

class MultiAnimation extends InputUser{
    left: number;
    right: number;
    down: number;
    up: number;
    key: string;
    currentDirection: string;
    constructor(gameEnitity:GameEntity, left:number, right:number, down:number, up:number, key:string, subject:Subject){
        super(gameEnitity, subject)
        this.left = left
        this.right = right
        this.down = down
        this.up = up
        this.key = key
        this.currentDirection = ""
    }


    override update(): void {
        this.setDirection()

        switch(this.currentDirection){
            case "left":
                if (this.input.isKeyDown(this.key)){
                    this.getAnimation()?.startTriggeredAnimation(this.left)
                }
                break
            case "right":
                if (this.input.isKeyDown(this.key)){
                    this.getAnimation()?.startTriggeredAnimation(this.right)
                }
                break

            case "up":
                if (this.input.isKeyDown(this.key)){
                    this.getAnimation()?.startTriggeredAnimation(this.up)
                }
                break

            case "down":
                if (this.input.isKeyDown(this.key)){
                    this.getAnimation()?.startTriggeredAnimation(this.down)
                }

        }

        super.update()
    }


    setDirection(){
        switch(this.input.lastInput){
            case "ArrowLeft":
                this.currentDirection = "left"
                break
            case "ArrowRight":
                this.currentDirection = "right"
                break
            case "ArrowUp":
                this.currentDirection = "up"
                break
            case "ArrowDown":
                this.currentDirection = "down"
        }
    }

} export default MultiAnimation