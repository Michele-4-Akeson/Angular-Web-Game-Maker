import { Entity } from "./Entity"

export interface LevelData{
    scale : number,
    columns : number,
    rows : number,
    background : (Entity|null)[],
    mainground : (Entity|null)[],
    foreground : (Entity|null)[],
}