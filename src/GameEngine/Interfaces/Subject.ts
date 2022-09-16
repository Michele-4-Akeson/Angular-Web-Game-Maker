import { Subscriber } from "./Subscriber"

export interface Subject{
    updateSubscribers(type:string, key:string):void
    addSub(subscriber:Subscriber):void
}
