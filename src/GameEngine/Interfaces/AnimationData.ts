import Spritesheet from "src/GameEngine/GameComponents/Spritesheet"

export interface AnimationData{
    spritesheet: Spritesheet | null
    xFrame:number, 
    yFrame:number, 
    frameSize:number, 
    speed:number, 
    active:boolean, 
    left: number, 
    right:number, 
    up:number, 
    down:number
}
