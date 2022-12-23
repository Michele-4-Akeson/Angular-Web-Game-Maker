import { Entity } from "./Entity";
import { LevelData } from "./LevelData";

export interface GameData{
    name:string,
    by:string,
    date:string,
    assets:{id:string, url:string}[],
    savedEntities:Entity[]
    levelData:LevelData


}