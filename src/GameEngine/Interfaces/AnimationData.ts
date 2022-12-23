import { SpritesheetData } from "./SpritesheetData"

export interface AnimationData{
    spritesheet: SpritesheetData | null
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
