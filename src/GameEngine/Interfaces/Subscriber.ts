import { Subject } from "./Subject";

export interface Subscriber{
    subscribe(subject:Subject):void
    subjectUpdate(type:string, key:string):void
}