import Animation from "../../GameComponents/Animation";
import BoxCollider from "../../GameComponents/BoxCollider";
import BoxTrigger from "../../GameComponents/BoxTrigger";
import Transform from "../../GameComponents/Transform";
import GameEntity from "../../Interfaces/GameEntity";
import GameObject from "../GameObject";
import Gravity from "./Physics/Gravity";

/**
 * The EntityDecorator class applies the decorator pattern. This class implements the GameEntity interface
 * and contains an instance of that interface as a field - Therefore, any EntityDecorator is both a GameEntity and has a GameEntity
 * and allows for the creating of different scripts that can be applied to wrapped around gameObjects and extend their functionality 
 * without modifiying the exsisting code
 * @property {GameEntity} gameEntity the game entity that is functionally extended upon by the EnityDecorator that uses it
 */
class EntityDecorator implements GameEntity{
    gameEntity:GameEntity
    constructor(entity:GameEntity){
        this.gameEntity = entity
    }
   
   
 

    update() {
        this.gameEntity.update()
    }
    getTransform(): Transform {
        return this.gameEntity.getTransform()
    }
    getBoxCollider(): BoxCollider | null {
        return this.gameEntity.getBoxCollider()
    }

    setBoxCollider(boxCollider:BoxCollider | null) {
        this.gameEntity.setBoxCollider(boxCollider)
    }

    setDynmaic(state: boolean): void {
        this.gameEntity.setDynmaic(state)
    }
  
    getAnimation(): Animation | null {
        return this.gameEntity.getAnimation()
    }
    getBoxTrigger(): BoxTrigger | null {
        return this.gameEntity.getBoxTrigger()
    }
    collisionEvent(gameObject: GameEntity) {
        this.gameEntity.collisionEvent(gameObject)
    }
    triggerEvent(gameObject: GameEntity) {
        this.gameEntity.collisionEvent(gameObject)
        
    }
    inputEvent(event: String) {
        this.gameEntity.inputEvent(event)
    }

    getTag(): String {
        return this.gameEntity.getTag()
    }
    getChildren(): GameEntity[] {
        return this.gameEntity.getChildren()
    }
    addChild(gameEntity: GameEntity): void {
        this.gameEntity.addChild(gameEntity)
    }
    
    enabled(): boolean {
        return this.gameEntity.enabled()
    }

    getActive(): boolean {
        return this.gameEntity.getActive()
    }
    
    setActive(state: boolean): void {
        return this.gameEntity.setActive(state)
    }

    setAnimation(animation: Animation | null): void {
        this.gameEntity.setAnimation(animation)
    }

    updatePosition(xref: number, yref: number): void {
        this.gameEntity.updatePosition(xref, yref)
    }
    getOnScreen(): boolean {
        return this.gameEntity.getOnScreen()
    }

    setBoxTrigger(trigger: BoxTrigger | null): void {
        this.gameEntity.setBoxTrigger(trigger)
    }

    goTo(direction: string): void {
        if (this.gameEntity.getAnimation()?.active){
            this.gameEntity.getAnimation()?.setDirection(direction)
        }
    }
  
 

    setOnScreen(state: boolean) {
        this.gameEntity.setOnScreen(state)
    }
} export default EntityDecorator