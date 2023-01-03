import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import InputUser from "../InputUser";

class TriggerAnimation extends InputUser{
    //need to apply keypress listener to ensure only one activation
    key:string
    frame:number
    isKeyDown = false
    constructor(gameEntity:GameEntity, frame:number, key:string, subject:Subject){
        super(gameEntity, subject)
        this.key = key
        this.frame = frame
    }


    override update(): void {
        if (this.input.isKeyDown(this.key) && !this.isKeyDown){
            this.isKeyDown = true
            if (this.getAnimation()){
                this.getAnimation()?.startTriggeredAnimation(this.frame)
                
            }
        }

        if (!this.input.isKeyDown(this.key)){
            this.isKeyDown = false
        }

        super.update()
    }
} export default TriggerAnimation
    