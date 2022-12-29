import { AnimationData } from "./AnimationData"
import { Decorator } from "./Decorator"



export interface Entity{
    name:string,
    tag:string,
    dynamic: boolean,
    sizeMultiplyer:number
    boxCollider:{active:boolean, right:boolean, left:boolean, top:boolean, bottom:boolean},
    boxTrigger: {active:boolean, size:number},
    animation: AnimationData
    decorators: Decorator[]

}