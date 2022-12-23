import Animation from "../GameComponents/Animation"
import BoxTrigger from "../GameComponents/BoxTrigger"
import Spritesheet from "../GameComponents/Spritesheet"
import AttachEntity from "../GameObjects/Decorators/AttachEntity"
import Bounce from "../GameObjects/Decorators/Bounce"
import DestroyedBy from "../GameObjects/Decorators/DestroyedBy"
import Follow from "../GameObjects/Decorators/Follow"
import Gravity from "../GameObjects/Decorators/Gravity"
import Health from "../GameObjects/Decorators/Health"
import MovementController from "../GameObjects/Decorators/MovementController"
import PlatformerController from "../GameObjects/Decorators/PlatformerController"
import ShowChild from "../GameObjects/Decorators/ShowChild"
import Speed from "../GameObjects/Decorators/Speed"
import Travel from "../GameObjects/Decorators/Travel"
import TriggerAnimation from "../GameObjects/Decorators/TriggerAnimation"
import GameObject from "../GameObjects/GameObject"
import { AnimationData } from "../Interfaces/AnimationData"
import { Entity } from "../Interfaces/Entity"
import GameEntity from "../Interfaces/GameEntity"
import { LevelData } from "../Interfaces/LevelData"
import { Map } from "../Interfaces/Map"
import GameManager from "./GameManager"

/**
 * Functions to generate GameObjects using a js Object containing data needed to generate a level for the game
 * 
 * @param {GameManager} gameManager a reference to the gameManager
 * @property {GameObject} player the player object used in the level of the game
 * @property {object} loadedLevel the js object containing all data for creation of a level for the game
 */
class LevelGenerator{
    player : GameEntity | null
    gameManager : GameManager
    loadedLevel : Map
    entityName: string = ""
    constructor(gameManager:GameManager){
        this.player = null
        this.gameManager = gameManager
        this.loadedLevel = {background:[], mainground: [], foreground:[], scale:0, columns:0, rows:0}

    }


    /**
     * starts the process of instaniating all gameObjects contain within map
     * @param {object} map a js object containig all data for creation of a level for the game 
     */
    build(map:LevelData){
        this.loadedLevel.scale = map.scale
        this.loadedLevel.columns = map.columns
        this.loadedLevel.rows = map.rows
        this.loadedLevel.background = (this.createLayer(map.background))
        this.loadedLevel.mainground = (this.createLayer(map.mainground))
        this.loadedLevel.foreground = (this.createLayer(map.foreground))
        console.log(this.loadedLevel)

    }


    createLayer(entities:(Entity|null)[]):(GameEntity|null)[]{
        let layer:(GameEntity|null)[] = []
        let gameEntity : GameEntity | null
        for (let entity of entities){
            if (entity){
                gameEntity = this.createGameEntity(entity)
                if (gameEntity){
                    layer.push(gameEntity)
                    
                    if (gameEntity.getTag() == "Player") {
                        console.log("PLAYER")
                        this.player = gameEntity
                    }
                } else {
                    layer.push(null)
                    throw Error(`Error: Missing Input in Entity:'${this.entityName}'` )
                }
            } else {
                layer.push(null)
            }

        }


        return layer



    }

    /**
     * 
     * @param {Entity} entity entity data fed from gameMaker
     * @returns {GameEntity} a instance of a gameEntity that will be added to the game
     */
    createGameEntity(entity:Entity): GameEntity | null{
        if (entity == null){
            return null
        } else {

            this.entityName = entity.name
            let gameEntity : GameEntity = new GameObject(this.loadedLevel.scale * entity.sizeMultiplyer, entity.dynamic, entity.tag)

            gameEntity.setAnimation(this.createAnimation(entity.animation))
            
            if (entity.boxTrigger.active){
                gameEntity.setBoxTrigger(new BoxTrigger(this.loadedLevel.scale * entity.sizeMultiplyer, this.loadedLevel.scale * entity.sizeMultiplyer * entity.boxTrigger.size, true,))
            }

            if (!entity.boxCollider){
                gameEntity.setBoxCollider(null)
            }

            let child:GameEntity|null = null
            for (let decorator of entity.decorators){
                switch(decorator.name){
                    case "Gravity":
                        gameEntity = new Gravity(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break;
                    case "Speed":
                        gameEntity = new Speed(gameEntity, <string>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break;
                    case "Attach":
                        child = this.createGameEntity(<Entity>decorator.inputs[0].value)
                        if (child){
                            gameEntity = new AttachEntity(gameEntity, child, <boolean>decorator.inputs[1].value, <number>decorator.inputs[2].value, <number>decorator.inputs[3].value)
                        } else {
                            throw new Error(`Error: Missing input in 'Attach' ability of '${this.entityName}'`)
                        }
                        break

                    case "Activate Child on Collision":
                        child = this.createGameEntity(<Entity>decorator.inputs[0].value)
                        if (child){
                            gameEntity = new ShowChild(gameEntity, child, <boolean>decorator.inputs[1].value, <number>decorator.inputs[2].value, <number>decorator.inputs[3].value)
                        } else {
                            throw new Error(`Error: Missing input in 'Attach' ability of '${this.entityName}'`)
                        }
                        break
                    
                    case "Bounce":
                        gameEntity = new Bounce(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break

                    case "MovementController":
                        gameEntity = new MovementController(gameEntity, <number>decorator.inputs[0].value, this.gameManager)
                        break

                    case "PlatformController":
                        gameEntity = new PlatformerController(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value, <number>decorator.inputs[2].value, this.gameManager)
                        break
                    
                    case "Follow":
                        gameEntity = new Follow(gameEntity,  <string>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break


                    case "Travel":
                        gameEntity = new Travel(gameEntity,  <string>decorator.inputs[0].value, <number>decorator.inputs[1].value, <number>decorator.inputs[2].value)
                        break

                    case "DestroyedBy":
                        gameEntity = new DestroyedBy(gameEntity,  <string>decorator.inputs[0].value)
                        break

                    case "Health-Bar":
                        gameEntity = new Health(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value, <string>decorator.inputs[2].value)
                        break

                    case "Trigger Animation on Input":
                        gameEntity = new TriggerAnimation(gameEntity, <number>decorator.inputs[0].value, <string>decorator.inputs[1].value, this.gameManager)
                        break
                    

                    default:

                }
            }

            return gameEntity

        }
        

    }


    createAnimation(animation:AnimationData):Animation{
        let spritesheet = new Spritesheet(document.getElementById(animation.spritesheet!.id) as HTMLImageElement, animation.spritesheet!.squareSize!) 
        let newAnimation = new Animation(spritesheet, animation.xFrame, animation.yFrame, animation.speed, animation.active)
        if (animation.active) newAnimation.setDirectionalFrames(animation.left, animation.right, animation.up, animation.down)

        return newAnimation
    }

    




    



 


} export default LevelGenerator