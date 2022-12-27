import { Entity } from "./Entity";
import { LevelData } from "./LevelData";

export interface HippoGame{
    name:string,
    by:string,
    date:string,
    shared:boolean,
    token:string,
    id:string
    gameData:{assets:{id:string, url:string}[], savedEntities:Entity[], levelData:LevelData}


}