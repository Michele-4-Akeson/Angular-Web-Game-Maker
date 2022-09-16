import GameEntity from "./GameEntity"

export interface Map{
    scale: number
    columns:number
    rows:number
    background: (GameEntity|null)[]
    mainground: (GameEntity|null)[]
    foreground: (GameEntity|null)[]
}