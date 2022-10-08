import { Type } from '@angular/compiler';
import { Injectable } from '@angular/core';
import Spritesheet from 'src/GameEngine/GameComponents/Spritesheet';
import { Decorator } from 'src/GameEngine/Interfaces/Decorator';
import { Entity } from 'src/GameEngine/Interfaces/Entity';
import { AnimationData } from '../../GameEngine/Interfaces/AnimationData';

import { Subject } from '../interfaces/Subject';
import { Subscriber } from '../interfaces/Subscriber';

@Injectable({
  providedIn: 'root'
})


export class EntityService implements Subject{
  private name:string = ""
  private tag:string = ""
  private dynamic: boolean = false
  private sizeMultiplyer:number = 1
  private boxCollider:boolean = false
  private boxTrigger = {active:false, size:1}
  private animation: AnimationData = { spritesheet: null, xFrame:0, yFrame:0, frameSize:0, speed:0, active:false, left: 0, right:0, up:0, down:0}
  private decorators:Decorator[] = []
  private subscribers:Subscriber[] = []
  private savedEntities:Entity[] = []

  private tags = [{id:" "}, {id:"Player"}, {id:"NPC"}, {id:"Enemy"}, {id:"Loot"}, {id:"Object"}, {id:"Item"}, {id:"Projectile"}, {id:"Platform"}, {id:"Tree"}]
  private decoratorNames = ["Gravity", "Attach", "Speed", "Bounce", "MovementController", "PlatformController", "Follow", "Travel", "DestroyedBy", "Health-Bar", "Activate Child on Collision", "Trigger Animation on Input"]
  constructor() {}


  getSize(){
    return this.sizeMultiplyer
  }

  getName(){
    return this.name
  }
  setName(name:string){
    this.name = name
  }

  getTags(){
    return this.tags
  }

  getTag(){
    return this.tag
  }

  setTag(tag:string){
    this.tag = tag
  }

  setSize(size:number){
    this.sizeMultiplyer = size
  }

  getDynamic(){
    return this.dynamic
  }

  setDynamic(state:boolean){
    this.dynamic = state
  }



  //////////////////////////////////
  // ANIMATION
  //////////////////////////////////
  getAnimation(){
    return this.animation
  }

  setSpriteSheet(spritesheet:Spritesheet, frameX:number, frameY:number){
    this.animation.spritesheet = spritesheet
    this.animation.frameSize = spritesheet.squareSize
    this.animation.xFrame = frameX
    this.animation.yFrame = frameY
    this.updateSubscribers()
  }

  getImage(){
    return this.animation.spritesheet?.sprite
  }

  setAnimationActive(active:boolean){
    this.animation.active = active
  }

  setAnimationLeft(frame:number){
    this.animation.left = frame
  }

  setAnimationRight(frame:number){
    this.animation.right = frame
  }

  setAnimationDown(frame:number){
    this.animation.down = frame
  }

  setAnimationUp(frame:number){
    this.animation.up = frame
  }

  setAnimationSpeed(speed:number){
    this.animation.speed = speed
  }


  
  ////////////////////////////////////
  // BOX COLLIDER/TRIGGER
  ////////////////////////////////////
  getBoxCollider(){
    return this.boxCollider
  }

  setBoxCollider(active:boolean){
    this.boxCollider = active
    
  }

  getBoxTrigger(){
    return this.boxTrigger
  }

  setBoxTriggerActive(active:boolean){
    this.boxTrigger.active = active
  }

  setBoxTriggerSize(size:number){
    this.boxTrigger.size = size
  }


  ////////////////////////////////////
  //DECORATOR
  ////////////////////////////////////
  getDecorators(){
    return this.decorators
  }

  getDecoratorNames(){
    return this.decoratorNames
  }

  addDecorator(name:string){
    let d : Decorator
    switch(name){
      case "Gravity":
        d = {name:name, inputs:[this.newInput("Acceleration", "number", 0), this.newInput("Max Speed", "number", 3)]}
        this.indexDecorator(d)
        break
      case "Attach":
        d = {name:name, inputs:[this.newInput("Game Object", "entity", null), this.newInput("bound", "boolean", true), this.newInput("x", "number", 0), this.newInput("y", "number", 0)]}
        this.indexDecorator(d)
        break
      case "Activate Child on Collision":
        d = {name:name, inputs:[this.newInput("Game Object", "entity", null), this.newInput("bound", "boolean", true), this.newInput("x", "number", 0), this.newInput("y", "number", 0)]}
        this.indexDecorator(d)
        break
      case "Speed":
        d = {name:name, inputs:[this.newInput("Direction", "string", "left"), this.newInput("Speed", "number", 0)]}
        this.indexDecorator(d)
        break
      case "Bounce":
          d = {name:name, inputs:[this.newInput("Power", "number", 0), this.newInput("Bounce Time", "number", 0)]}
          this.indexDecorator(d)
          break
      case "MovementController":
        d = {name:name, inputs:[this.newInput("Speed", "number", 0)]}
        this.indexDecorator(d)
        break
      case "PlatformController":
        d = {name:name, inputs:[this.newInput("Jump Force", "number", 0), this.newInput("Jump Time", "number", 0), this.newInput("Movement Speed", "number", 0)]}
        this.indexDecorator(d)
        break
      case "Follow":
        d = {name:name, inputs:[this.newInput("Target Tag", "string", "Player"), this.newInput("Movement Speed", "number", 0)]}
        this.indexDecorator(d)
        break
      case "Travel":
        d = {name:name, inputs:[this.newInput("Path (horizontal or vertical)", "string", "horizontal"), this.newInput("Range", "number", 0), this.newInput("Speed", "number", 0)]}
        this.indexDecorator(d)
        break
      case "DestroyedBy":
        d = {name:name, inputs:[this.newInput("Tag", "string", "Enemy")]}
        this.indexDecorator(d)
        break
      case "Health-Bar":
        d = {name:name, inputs:[this.newInput("health", "number", "1"), this.newInput("damage per hit", "number", "1"), this.newInput("hurt by tag", "string", "Enemy")]}
        this.indexDecorator(d)
        break
      case "Trigger Animation on Input":
        d = {name:name, inputs:[this.newInput("frame", "number", "1"), this.newInput("input key", "string", "w")]}
        this.indexDecorator(d)
        break
    }

  }

  indexDecorator(decorator:Decorator){
    let index = this.decorators.length
    decorator.index = index
    this.decorators.push(decorator)

  }

  removeDecorator(name:string){
    this.decorators = this.decorators.filter(decorator=>decorator.name != name)
    let index = 0
    for (let decorator of this.decorators){
      decorator.index = index
      index+=1
    }
  }


  newInput(name:string, type:string, value:any){
    return {name, type, value}
  }

  setInput(decoratorName:string, index:number, valueType:string, valueName:string, value:any){
    console.log(decoratorName, index, valueName, value)
    for (let decorator of this.decorators){
      if (decorator.name == decoratorName){
        for (let input of decorator.inputs){
          if (input.name == valueName && decorator.index == index){
            if (valueType == "entity"){
              input.value = this.getEntity(value)
            } else {
              input.value = value
            }
            
          }
        }
      }
    }
  }



  ////////////////////////////////////
  // ENTITY PREP
  ////////////////////////////////////

  clearEntity(){
    this.name = ""
    this.tag = ""
    this.dynamic = false
    this.sizeMultiplyer = 1
    this.boxCollider = false
    this.boxTrigger = {active:false, size:1}
    this.animation = { spritesheet: null, xFrame:0, yFrame:0, frameSize:0, speed:0, active:false, left: 0, right:0, up:0, down:0}
    this.decorators = []
    this.updateSubscribers()
  }

  createEntity():Entity{
    return {
      name:this.name,tag:this.tag, dynamic: this.dynamic, sizeMultiplyer: this.sizeMultiplyer, 
      boxCollider:this.boxCollider, boxTrigger: this.boxTrigger, animation:this.animation,
      decorators: this.decorators}
  }

  saveEntity(){
    let index : number = 0
    for (let entity of this.savedEntities){
      if (entity.name == this.name){
        this.savedEntities[index] = this.createEntity()
        this.clearEntity()
        console.log("SAAAAVVVEEEDDD OOOOVEEEERRR")
        return
      }
      index += 1

    }

    this.savedEntities.push(this.createEntity())
    this.clearEntity()
    console.log("SAAAAVVVEEEDDD")
    console.log(this.savedEntities)
  }

  getEntity(name:string):Entity | null{
    for (let entity of this.savedEntities){
      if (entity.name == name){
        console.log(entity)
        return entity
      }
    }
    return null

  }

  selectEntity(name:string){
    const entity = this.getEntity(name)
    this.name = entity!.name
    this.tag = entity!.tag
    this.dynamic = entity!.dynamic
    this.sizeMultiplyer = entity!.sizeMultiplyer
    this.boxCollider = entity!.boxCollider
    this.boxTrigger = {...entity!.boxTrigger}
    this.animation = {...entity!.animation}
    this.decorators = [...entity!.decorators]

    this.updateSubscribers()
    
  }

  deleteEntity(name:string){
    this.savedEntities = this.savedEntities.filter(entity=>entity.name != name)
  }



  getSavedEntities(){
    return this.savedEntities.filter(entity=>entity.name)
  }


 


  //////////////////////////////////
  // OBSERVER PATTERN
  //////////////////////////////////

  addSubscriber(sub: Subscriber): void {
    console.log(sub)
    this.subscribers.push(sub)
  }
  
  updateSubscribers(): void {
    for(let sub of this.subscribers){
      sub.subscriptionUpdate()
    }
  }




}