import { Injectable } from '@angular/core';
import { Entity } from 'src/GameEngine/Interfaces/Entity';
import { HippoGame } from 'src/GameEngine/Interfaces/HippoGame';
import { LevelData } from 'src/GameEngine/Interfaces/LevelData';

import { Subject } from '../interfaces/Subject';
import { Subscriber } from '../interfaces/Subscriber';

@Injectable({
  providedIn: 'root'
})
export class LevelService implements Subject {
  public name:string = ""
  public id:string = ""
  public shared:boolean = false
  private levelData:LevelData
  private layer: string
  private subscribers:Subscriber[] = []
  constructor() { 
    this.levelData = {scale:32, columns:32, rows:32, background:[], mainground:[], foreground:[]}
    this.makeLevel()
    this.layer = "mainground"
  }

  getLevelData(){
    return this.levelData
  }

  getScale(){
    return this.levelData.scale
  }


  getColumns(){
    return this.levelData.columns
  }

  getRows(){
    return this.levelData.rows
  }

  getLayer(){
    return this.layer
  }

  setLayer(layer:string){
    this.layer = layer
  }

  setScale(n:number){
    console.log(this.levelData.scale, n)
    this.levelData.scale = n
  }

  setColumns(n:number){
    this.levelData.columns = n
  }

  setRows(n:number){
    this.levelData.rows = n
  }


  resizeLevel(columns:number, rows:number){
    this.setColumns(columns)
    this.setRows(rows)
    this.makeLevel()
  }


  /////////////////////////////////
  // ENTITY PLACEMENT
  /////////////////////////////////
  
  getIndex(columnIndex:number, rowIndex:number){
    return columnIndex + (this.levelData.columns * rowIndex)
   

}

  addEntity(position:number[], entity:Entity){
    const index = this.getIndex(position[0], position[1])
    switch(this.layer){
      case "background":
        this.levelData.background[index] = entity
        break
      case "mainground":
        this.levelData.mainground[index] = entity
        break
    }


  }

  removeEntity(position:number[]){
    const index = this.getIndex(position[0], position[1])
    console.log("remove", position)
    switch(this.layer){
      case "background":
        this.levelData.background[index] = null
        break
      case "mainground":
        this.levelData.mainground[index] = null
        break
    }

  }


  //////////////////////////////////
  // LEVEL PREP
  //////////////////////////////////

  clearLevel(){
    this.levelData.background = []
    this.levelData.mainground = []
    this.levelData.foreground = []
  }


  makeLevel(){
    this.clearLevel()
    let i = 0
    while (i < this.levelData.columns * this.levelData.rows){
        this.levelData.background.push(null)
        this.levelData.mainground.push(null)
        this.levelData.foreground.push(null)
        i += 1
    }
  }

 

  exportToJsonFile() {
    let dataStr = JSON.stringify(this.levelData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    let exportFileDefaultName = 'data.json'

    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }



  addSubscriber(sub: Subscriber): void {
    this.subscribers.push(sub)
    
  }


  updateSubscribers(): void {
    for (let sub of this.subscribers){
      sub.subscriptionUpdate()
    }

  }



  /*
  Editor Prep
  */

  loadGame(data:HippoGame){
    this.name = data.name
    this.shared = data.shared
    this.id = data.id
    this.levelData = data.gameData.levelData
  }


  








}
