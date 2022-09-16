import BoxCollider from "../GameComponents/BoxCollider";
import GameEntity from "../Interfaces/GameEntity";
import CollisionSystem from "./CollisionSystem";

/**
 * The CollisionSystem class functions to check for collisions of gameObjects boxColliders
 * and zoneCollider component for all currently active GameObjects
 * 
 * The collisionDataystem will determine the side in which collision occured 
 * between two object, and update
 * 
 */
class TriggerSystem extends CollisionSystem {
    boxTriggerObjects:GameEntity[]
    boxColliderObjects:GameEntity[]
    constructor(){
        super()
        this.boxTriggerObjects = []
        this.boxColliderObjects = []
    }


    override addGameObjects(objects: (GameEntity|null)[]): void {
        for (let object of objects){
            if (object != null){
                console.log(object)
                if (object.getBoxTrigger()){
                    this.boxTriggerObjects.push(object)
                }

                if (object.getBoxCollider()){
                    this.boxColliderObjects.push(object)
                }
            }
            
        }
    }


    override update(): void {
        this.checkCount = 0

        for (let objectA of this.boxTriggerObjects){
            if (objectA.enabled()){
                
                for (let objectB of this.boxColliderObjects){
                    if (objectB.enabled()){
                        this.checkCount+=1
                        this.didTrigger(objectA, objectB)
                        
                    }
                }
            }
        }
    }



    didTrigger(objectA:GameEntity, objectB:GameEntity){
        if (objectB.enabled()){
            this.checkCount += 1;
            if (objectA != objectB && this.checkforCollision(objectA.getBoxTrigger()!, objectB.getBoxCollider()!)){
                this.emmitTriggerEvent(objectA, objectB);
            }
        }
    }


    emmitTriggerEvent(object1: GameEntity, object2: GameEntity): void {
        object1.triggerEvent(object2)
        object1.getBoxTrigger()!.updateCollision(object2)
        this.updateCollisionData(object1.getBoxTrigger()!, object2.getBoxCollider()!)
    }

    
    /**
     * applyCollision() updates the collision data of each zoneCollider, collider1, and collider2, with fields
     * such as the tag of the object which it collided with, and the side that collision occured
     * @param {ZoneCollider} collider1 
     * @param {ZoneCollider} collider2 
     */
    
     override updateCollisionData(collider1: BoxCollider, collider2: BoxCollider): void {
        // checks distance between the sides of each collider to see which side is colliding
        this.distanceRight = Math.abs(collider1.sides.right - collider2.sides.left);
        this.distanceLeft = Math.abs(collider1.sides.left - collider2.sides.right);
        this.distanceTop = Math.abs(collider1.sides.top - collider2.sides.bottom);
        this.distanceBottom = Math.abs(collider1.sides.bottom - collider2.sides.top);

        switch(this.sideOfCollision(this.distanceRight, this.distanceLeft, this.distanceTop, this.distanceBottom)){
            case "right":
                collider1.collisionData.right = true;
                this.collisionList.right = true;
                break;
            case "left":
                collider1.collisionData.left = true;
                this.collisionList.left = true;
                break;
            case "top":
                collider1.collisionData.top = true;
                this.collisionList.top = true;
                break;
            case "bottom":
                collider1.collisionData.bottom = true;
                this.collisionList.bottom = true;
                break;
        } 
    }
  


} export default TriggerSystem