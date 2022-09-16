import { Entity } from "./Entity";



export interface Decorator{
    name:string
    inputs: {name:string, type:string, value: string|boolean|number|Entity|null}[]
    index?:number
    
}