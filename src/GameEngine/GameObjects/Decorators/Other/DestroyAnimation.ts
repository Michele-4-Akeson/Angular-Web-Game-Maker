import { animation } from "@angular/animations";
import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import EntityDecorator from "../EnityDecorator";

class DestroyAnimation extends EntityDecorator{
    frame:number = 0
    animationStarted:boolean = false
    constructor(gameEntity:GameEntity, frame:number){
        super(gameEntity)
        this.frame = frame
    }


    /**
     * will start ending animation, that, once complete, will deactive the entity
     */
    override setActive(state: boolean): void {
        if (state == false){
            if (!this.animationStarted){
                this.animationStarted = true
                this.getAnimation()?.startPairedAnimation(this.frame, ()=>{
                    this.animationStarted = false
                    super.setActive(false)
                    
                })

            }
          
        } else {
            super.setActive(state)
        }


    }
} export default DestroyAnimation