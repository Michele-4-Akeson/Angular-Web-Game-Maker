import { AnimationData } from "./AnimationData"
import { Decorator } from "./Decorator"

export interface Entity{
    name:string,
    tag:string,
    dynamic: boolean,
    sizeMultiplyer:number
    boxCollider:boolean,
    boxTrigger: {active:boolean, size:number},
    animation: AnimationData
    decorators: Decorator[]

}