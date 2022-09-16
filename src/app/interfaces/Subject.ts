import { Subscriber } from "./Subscriber"

export interface Subject{
    addSubscriber(sub:Subscriber):void
    updateSubscribers():void
}