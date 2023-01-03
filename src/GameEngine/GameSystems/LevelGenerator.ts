import Animation from "../GameComponents/Animation"
import BoxTrigger from "../GameComponents/BoxTrigger"
import Spritesheet from "../GameComponents/Spritesheet"
import AttachEntity from "../GameObjects/Decorators/Children/AttachEntity"
import Bounce from "../GameObjects/Decorators/Physics/Bounce"
import DestroyedBy from "../GameObjects/Decorators/Other/DestroyedBy"
import Follow from "../GameObjects/Decorators/Movement/Follow"
import Gravity from "../GameObjects/Decorators/Physics/Gravity"
import Health from "../GameObjects/Decorators/Other/Health"
import MovementController from "../GameObjects/Decorators/Movement/MovementController"
import PlatformerController from "../GameObjects/Decorators/Movement/PlatformerController"
import ShowChild from "../GameObjects/Decorators/Children/ShowChild"
import Speed from "../GameObjects/Decorators/Movement/Speed"
import Travel from "../GameObjects/Decorators/Movement/Travel"
import TriggerAnimation from "../GameObjects/Decorators/Other/TriggerAnimation"
import GameObject from "../GameObjects/GameObject"
import { AnimationData } from "../Interfaces/AnimationData"
import { Entity } from "../Interfaces/Entity"
import GameEntity from "../Interfaces/GameEntity"
import { LevelData } from "../Interfaces/LevelData"
import { Map } from "../Interfaces/Map"
import GameManager from "./GameManager"
import MultiAnimation from "../GameObjects/Decorators/Other/MultiAnimation"
import Spawner from "../GameObjects/Decorators/Children/Spawner"
import Projectile from "../GameObjects/Decorators/Children/Projectile"
import DestroyAnimation from "../GameObjects/Decorators/Other/DestroyAnimation"

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
    childList:GameEntity[] = []
    
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
        //console.log(this.loadedLevel)

    }


    createLayer(entities:(Entity|null)[]):(GameEntity|null)[]{
        let layer:(GameEntity|null)[] = []
        let gameEntity : GameEntity | null
        for (let entity of entities){
            if (entity){
                gameEntity = this.createGameEntity(entity)
                if (gameEntity){
                    layer.push(gameEntity)
                    if (gameEntity.getTag()=="Camera Target"){
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

        console.log(layer)

       



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
            let gameEntity : GameEntity = new GameObject(this.loadedLevel.scale * entity.sizeMultiplyer, entity.tag)

            gameEntity.setAnimation(this.createAnimation(entity.animation))
            
            if (entity.boxTrigger.active){
                gameEntity.setBoxTrigger(new BoxTrigger(this.loadedLevel.scale * entity.sizeMultiplyer, this.loadedLevel.scale * entity.sizeMultiplyer * entity.boxTrigger.size))
            }

            if (!entity.boxCollider.active){
                gameEntity.setBoxCollider(null)
            } else {
                gameEntity.getBoxCollider()?.setActiveSides(entity.boxCollider)
            }



            let child:GameEntity|null = null
            for (let decorator of entity.decorators){
                switch(decorator.name){

                     /**
                     * PHYSICS DECORATORS
                     */
                    case "Gravity":
                        gameEntity = new Gravity(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break;

                    case "Speed":
                        gameEntity = new Speed(gameEntity, <string>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break;


                    case "Bounce":
                        gameEntity = new Bounce(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break



                     /**
                     * MOVEMENT DECORATORS
                     */
                    case "Top Down Movement":
                        gameEntity = new MovementController(gameEntity, <number>decorator.inputs[0].value, this.gameManager)
                        break

                    case "2D Platform Movement":
                        gameEntity = new PlatformerController(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value, <number>decorator.inputs[2].value, this.gameManager)
                        break
                    
                    case "Follow":
                        gameEntity = new Follow(gameEntity,  <string>decorator.inputs[0].value, <number>decorator.inputs[1].value)
                        break

                    case "Travel":
                        gameEntity = new Travel(gameEntity,  <string>decorator.inputs[0].value, <number>decorator.inputs[1].value, <number>decorator.inputs[2].value)
                        break


                     /**
                     * OTHER DECORATORS
                     */

                    case "DestroyedBy":
                        gameEntity = new DestroyedBy(gameEntity,  <string>decorator.inputs[0].value)
                        break

                    case "Health-Bar":
                        gameEntity = new Health(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value, <string>decorator.inputs[2].value, <number>decorator.inputs[3].value)
                        break

                    case "Trigger Animation on Input":
                        gameEntity = new TriggerAnimation(gameEntity, <number>decorator.inputs[0].value, <string>decorator.inputs[1].value, this.gameManager)
                        break

                    case "Multi-Animation":
                        gameEntity = new MultiAnimation(gameEntity, <number>decorator.inputs[0].value, <number>decorator.inputs[1].value, <number>decorator.inputs[2].value, <number>decorator.inputs[3].value, <string>decorator.inputs[4].value, this.gameManager)
                        break

                    case "Animation on Destroy":
                        gameEntity = new DestroyAnimation(gameEntity, <number>decorator.inputs[0].value)
                        console.log(gameEntity)
                        break

                    /**
                     * CHILDREN DECORATORS
                     */
                    case "Attach":
                        child = this.createGameEntity(<Entity>decorator.inputs[0].value)
                        if (child){
                            gameEntity = new AttachEntity(gameEntity, child, <boolean>decorator.inputs[1].value, <number>decorator.inputs[2].value, <number>decorator.inputs[3].value)
                            this.childList.push(child)
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

                    case "Spawner":
                        gameEntity = new Spawner(
                            gameEntity, 
                            this.createObjectPool(<Entity>decorator.inputs[0].value, <number>decorator.inputs[1].value), 
                            <number>decorator.inputs[2].value, <number>decorator.inputs[3].value, <boolean>decorator.inputs[4].value,
                            <boolean>decorator.inputs[5].value, <number>decorator.inputs[6].value, <number>decorator.inputs[7].value) 
                        break

                    case "Shoot Projectile on Input":
                        gameEntity = new Projectile(gameEntity, this.createObjectPool(<Entity>decorator.inputs[0].value, <number>decorator.inputs[1].value), <number>decorator.inputs[2].value, 
                        <number>decorator.inputs[3].value, <number>decorator.inputs[4].value, <string>decorator.inputs[5].value, this.gameManager)
                        break

                    default:
                        console.log("Invalid Decorator")

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


    /**
     * 
     * @param entity the entity to be cloned and added to objectPool
     * @param count the number of entities to be created
     * @returns a list of gameEntities
     */
    createObjectPool(entity:Entity, count:number){
        let spawnList = []
        let child
        //generates 10 child clones for spawning
        for (let i = 0; i < count; i++){
            child = this.createGameEntity(entity)
            if (child) spawnList.push(child)
        }

        return spawnList

    }

    




    



 


} export default LevelGenerator