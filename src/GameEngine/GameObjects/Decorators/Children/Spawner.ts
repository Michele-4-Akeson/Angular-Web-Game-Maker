import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import EntityDecorator from "../EnityDecorator";
import InputUser from "../InputUser";

class Spawner extends EntityDecorator{
    objectPool: GameEntity[];
    spawnedObjects:GameEntity [] = []
    spawnTime: number;
    unspawnTime: number;
    canSpawn: boolean;
    bound: boolean;
    offsetX: number;
    offsetY: number;
    random: boolean;
    timeOutCalled = false
    hasRef:boolean = false

    

    constructor(gameEntity:GameEntity, spawnChildren:GameEntity[], spawnTime:number, despawnTime:number, bound:boolean, random:boolean, offsetX:number, offsetY:number){
        super(gameEntity)
        this.objectPool = spawnChildren
        this.spawnTime = spawnTime
        this.unspawnTime = despawnTime
        this.canSpawn = false
        this.bound = bound
        this.offsetX = offsetX * this.getTransform().getSize()
        this.offsetY = offsetY * this.getTransform().getSize()
        this.random = random

        for (let child of spawnChildren){
            child.setActive(false)
            child.setDynmaic(true)
            this.addChild(child)
        }
    }


    override update(): void {
        if (this.canSpawn){
            this.canSpawn = false
            this.timeOutCalled = false
            let spawnChild = this.getSpawnable()
            if (spawnChild){
                this.spawn(spawnChild)
            }


        } else {
            if (!this.timeOutCalled){
                this.timeOutCalled = true
                setTimeout(()=>{
                    this.canSpawn = true
                
                }, this.spawnTime * 1000)
            }
          
        }



        for (let child of this.objectPool){
            if (child.enabled()){
                child.update()

                if (this.bound){
                    this.followParent(child)
                }

                let positionX = child.getTransform().getPositionX()
                let positionY = child.getTransform().getPositionY()
                child.getBoxCollider()?.update(positionX, positionY)
            }
        }

        super.update()

    }


    /**
     * 
     * @returns a child that is not currently active, and therfore avaiable to be spawned, or null
     * if no 
     */
    getSpawnable(){
        for (let child of this.objectPool){
            if (!child.enabled()){
                return child
            }
        }
        return null
    }



    /**
     * This function takes a given child, sets it's coordinates, and then 
     * sets the obejct to be active such that it begins to execute it's code. 
     * 
     * After a given amount of time, the child will unspawn
     * 
     * @param child the child to be spawned at either a random or set location
     */
    spawn(child:GameEntity){
        child.setActive(true)
        this.followParent(child)
        if (this.random){
            this.applyOffset(child, Math.random() * this.offsetX, Math.random() * this.offsetY)
        } else {
            this.applyOffset(child, this.offsetX, this.offsetY)
        }


        setTimeout(()=>{
            if (child.getActive()) child.setActive(false)
        }, this.unspawnTime * 1000)


    }


    followParent(child:GameEntity){
        let parentPositionX = this.gameEntity.getTransform().getPositionX()
        let parentPositionY = this.gameEntity.getTransform().getPositionY()
        child.updatePosition(parentPositionX, parentPositionY)
    }

    

    /**
     * 
     * @param child the child game enitity
     * @param x the x offset the child will be placed at
     * @param y the y offset the child will be placed at
     */
    applyOffset(child:GameEntity, x:number, y:number){
        child.getTransform().setX(x)
        child.getTransform().setY(y)
    }


} export default Spawner


