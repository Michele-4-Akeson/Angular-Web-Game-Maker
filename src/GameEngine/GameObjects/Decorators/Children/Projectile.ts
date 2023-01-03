import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";import { buffer } from "stream/consumers";
import InputUser from "../InputUser";
import Speed from "../Movement/Speed";

class Projectile extends InputUser{
    projectilePool: GameEntity[];
    speed: number;
    spawnTime: number;
    unspawnTime: number;
    canSpawn = true
    projectileIndex = 0
    currentDirection: string = ""
    buffer = 10
    key: string;
    /**
     * NOTE - Somewhat broken when game object is target of camera
     *      - probably becuase the child objects are not actually part of the 
     *      - layer, therfore, they aren't moved relative to the camera; and this is what we want
     *      - for normal children but not projectiles -- no immediate solution 
     * @param gameEntity 
     * @param projectilePool 
     * @param speed 
     * @param spawnTime 
     * @param unspawnTime 
     * @param key 
     * @param subject 
     */
    constructor(gameEntity:GameEntity, projectilePool:GameEntity[], speed:number, spawnTime:number, 
                unspawnTime:number, key:string, subject:Subject){

        super(gameEntity, subject)
        // Note the offset values are just placeholder -- to decide where to spawn a projectile will be based on 
        // last direction traveled
        this.projectilePool = projectilePool
        this.speed = speed
        this.spawnTime = spawnTime
        this.unspawnTime = unspawnTime
        this.key = key

        for (let child of projectilePool){
            child.setActive(false)
            child.setDynmaic(true)
            gameEntity.addChild(child)
        }
    }


    override update(): void {
        this.setDirection()
        if (this.input.isKeyDown(this.key)){
            this.spawnProjectile()
        }

        for (let child of this.projectilePool){
            if (child.enabled()){
                let positionX = child.getTransform().getPositionX()
                let positionY = child.getTransform().getPositionY()
                child.getBoxCollider()?.update(positionX, positionY)
                child.update()
            }
        }

        super.update()


       
    }


    spawnProjectile(){
        if (this.canSpawn){
            this.canSpawn = false
            let projectile = this.getSpawnable()
            if (projectile){
                let unDecoratedProjectile = projectile
                projectile.setActive(true)
                this.placeAtParent(projectile)
                let parentSize = this.getTransform().getSize()
                switch(this.currentDirection){
                    case "left":
                        this.applyOffset(projectile, -parentSize, 0)
                        projectile = new Speed(projectile, this.currentDirection, this.speed)
                        break

                    case "right":
                        this.applyOffset(projectile, parentSize, 0)
                        projectile = new Speed(projectile, this.currentDirection, this.speed) 
                        break
        
                    case "up":
                        this.applyOffset(projectile, 0, -parentSize)
                        projectile = new Speed(projectile, this.currentDirection, this.speed)
                        break
        
                    case "down":
                        this.applyOffset(projectile, 0, parentSize)
                        projectile = new Speed(projectile, this.currentDirection, this.speed)
                        break;
                    default:
                        console.log("----- projectile error")
                    
                }

                this.projectilePool[this.projectileIndex] = projectile
                let index = this.projectileIndex
                setTimeout(()=>{
                    projectile?.setActive(false)
                    this.projectilePool[index] = unDecoratedProjectile
                }, this.unspawnTime * 1000)
            }

            setTimeout(()=>{
                this.canSpawn = true

            }, this.spawnTime * 1000)


        }
    }


    /**
     * gets a spawnable child and sets the child index such that the 
     * position of that child in the projectile pool is tracked 
     * @returns a child object that is currently inactive
     * or null if all children are active (currently spawned)
     */
    getSpawnable(){
        for (let i = 0; i < this.projectilePool.length; i++){
            if (!this.projectilePool[i].enabled()){
                this.projectileIndex = i
                return this.projectilePool[i]
            }
            
        }

        return null
    }


    setDirection(){
        switch(this.input.lastInput){
            case "ArrowLeft":
                this.currentDirection = "left"
                break
            case "ArrowRight":
                this.currentDirection = "right"
                break
            case "ArrowUp":
                this.currentDirection = "up"
                break
            case "ArrowDown":
                this.currentDirection = "down"
        }
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

    /**
     * sets the position of the child entoty to be at the parent's position
     * @param child the child entity
     */
    placeAtParent(child:GameEntity){
        let parentPositionX = this.gameEntity.getTransform().getPositionX()
        let parentPositionY = this.gameEntity.getTransform().getPositionY()
        child.getBoxCollider()?.update(parentPositionX, parentPositionY)
        child.updatePosition(parentPositionX, parentPositionY)
    }


} export default Projectile