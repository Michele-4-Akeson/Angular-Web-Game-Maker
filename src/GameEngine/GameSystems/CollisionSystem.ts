
import BoxCollider from "../GameComponents/BoxCollider.js";
import GameEntity from "../Interfaces/GameEntity.js";


interface CollisonData{
    right: boolean, left: boolean, top: boolean, bottom: boolean
}


/**
 * The CollisionSystem class functions to check collisionData between
 * different BoxCollider component for all currently active GameObjects
 * The collisionDataystem will determine the side in which collision occured 
 * between two object, and update the BoxColiider of both objects (which is used
 * to control game logic and events such as object movement, and in-game events)
 * 
 * The performance of the collision system is improved by using the following:
 * - the systrem only iterates through gameObjects which are dynamic (a.k.a they can move
 * positions reltaive to their load position) and checks if they've collided with any other gameObject
 * - only boxColiiders which are currently active are checked
 * 
 * @property {Array<GameObject>} dynamicGameObjects an array of all dyanmic/moving gameObjects with colliders
 * @property {Array<GameObject>} staticGameObjects an array of all dyanmic/moving gameObjects with colliders
 * @property {object} collisonLis an object describing the current collison state of a given gameObject

*/
 class CollisionSystem {
    playerCollider : BoxCollider | null
    dynamicGameObjects : GameEntity[]
    staticGameObjects : GameEntity[]
  
    distanceRight : number
    distanceLeft : number
    distanceTop : number
    distanceBottom : number
    collisionList : CollisonData
    
    performanceCheck : boolean
    checkCount : number
    constructor(){
        this.playerCollider = null
        this.dynamicGameObjects = [];
        this.staticGameObjects = [];
      
        this.distanceRight = 0
        this.distanceLeft = 0
        this.distanceTop = 0
        this.distanceBottom = 0
        this.collisionList = {right: false, left: false, top: false, bottom: false};
        
        this.performanceCheck = false;
        this.checkCount = 0;
        
    }


    /**
     * adds all GameObjects with BoxColliders to either dynamicGameObjects (if 
     * gameObject moves) and staticGameObjects (if gameObject does not move)
     * @param {Array<GameObject>} objects an array of GameObjects 
     */
    addGameObjects(objects:(GameEntity|null)[]){
        for (let object of objects){

            if (object != null && object.getBoxCollider() != null) {
                if (object.getBoxCollider()?.dynmaic) {
                    this.dynamicGameObjects.push(object);
                    for (let child of object.getChildren()){
                        if (child.getBoxCollider()) this.dynamicGameObjects.push(child)
                    }
                } else {
                    this.staticGameObjects.push(object);
                    for (let child of object.getChildren()){
                        if (child.getBoxCollider()) this.staticGameObjects.push(child)
                    }

                }
            }

        }

    }


    /**
     * iterates through all GameObjects in dynamicGameObjects and determines if a collision occurs between
     * two or more objects. If a collision occurs, the BoxCollider component of each object is update
     * 
     * Note: dynamicGameObjects are compared with all other GameObjects, however, staticGameObjects are not compared
     * as only dynamicGameObjects will ever change the BoxCollider data of objects
     */
    update(){
        this.checkCount = 0;

        for (let objectA of this.dynamicGameObjects){
           this.clearList()

            if (objectA.enabled()){
                
                // checking collisions with all other dynmaic(moving) gameObjects
                for (let objectB of this.dynamicGameObjects){ 
                   this.didCollide(objectA, objectB)

                }
    

                // checking collisions with all static(non-moving) gameObjects
                // Note: the data of a Static Object's BoxCollider remains constant; if the player touches a pot, that pot will continually have "player" as the collisionTag
                // as staticObjects don't update their boxColliders
                for (let staticObject of this.staticGameObjects){
                   this.didCollide(objectA, staticObject)
                   
                }

                objectA.getBoxCollider()?.checkCollisions(this.collisionList);


            }

            this.checkPerformance();
            
           
           
        }
    }


    /**
     * updates the collision data of each GameObjects' BoxCollider, with fields
     * such as the tag of the object which it collided with, the object itself, and the side that 
     * collision occured
     * @param {GameObject} object1 object being checked for collison with object2 
     * @param {GameObject} object2 object being checked for collison with object1
     */
    emmitCollisionEvent(object1:GameEntity, object2:GameEntity){
        object1.collisionEvent(object2)
        object2.collisionEvent(object1)

        object1.getBoxCollider()!.updateCollision(object2);
        object2.getBoxCollider()!.updateCollision(object1);
        this.updateCollisionData(object1.getBoxCollider()!, object2.getBoxCollider()!);
    }





    /**
     * updates the collision data of each BoxCollider, collider1, and collider2, with fields
     * such as the tag of the object which it collided with, and the side that collision occured
     * @param {BoxCollider} collider1 
     * @param {BoxCollider} collider2 
     */
    updateCollisionData(collider1:BoxCollider, collider2:BoxCollider){
        // checks distance between the sides of each collider to see which side is colliding
        this.distanceRight = Math.abs(collider1.sides.right - collider2.sides.left);
        this.distanceLeft = Math.abs(collider1.sides.left - collider2.sides.right);
        this.distanceTop = Math.abs(collider1.sides.top - collider2.sides.bottom);
        this.distanceBottom = Math.abs(collider1.sides.bottom - collider2.sides.top);

        switch(this.sideOfCollision(this.distanceRight, this.distanceLeft, this.distanceTop, this.distanceBottom)){
            case "right":
                collider1.collisionData.right = true;
                collider2.collisionData.left = true;
                this.collisionList.right = true;
                break;
            case "left":
                collider1.collisionData.left = true;
                collider2.collisionData.right = true;
                this.collisionList.left = true;
                break;
            case "top":
                collider1.collisionData.top = true;
                collider2.collisionData.bottom = true;
                this.collisionList.top = true;
                break;
            case "bottom":
                collider1.collisionData.bottom = true;
                collider2.collisionData.top = true;
                this.collisionList.bottom = true;
                break;
        } 
    }


    /**
     * iterates through all GameObjects in dynamicGameObjects and determines if a collision occurs between
     * two or more objects. If a collision occurs, the BoxCollider component of each object is updated
     * 
     * Note: dynamicGameObjects are compared with all other GameObjects, however, staticGameObjects are not compared
     * as only dynamicGameObjects will ever change the BoxCollider data of objects
     * @param {ChildObject} child 
     * @param {GameObject} parent 
     */
    childBoxColliders(child:GameEntity, parent:GameEntity) {
      
        this.collisionList.right = false;
        this.collisionList.left = false;
        this.collisionList.top = false;
        this.collisionList.bottom = false;
        
        if (child.enabled()){
                for (let objectB of this.dynamicGameObjects){
                    if (objectB.enabled()){
                        this.checkCount += 1;
                        if (this.checkforCollision(child.getBoxCollider()!, objectB.getBoxCollider()!)){
                            console.log("Child Collision")
                            this.emmitCollisionEvent(child, objectB);
                        
                        }

                    }
                   
                }
    
    
                for (let staticObject of this.staticGameObjects){
                    if (staticObject.enabled()){
                        this.checkCount += 1;
                        if (this.checkforCollision(child.getBoxCollider()!, staticObject.getBoxCollider()!)){
                            this.emmitCollisionEvent(child, staticObject);
                        }
                    }
                }

                child.getBoxCollider()?.checkCollisions(this.collisionList);


        }
    }



    /**
     * returns true if a collision has occured between collider1 and collider2
     * @param {BoxCollider} collider1 
     * @param {BoxCollider} collider2 
     * @returns 
     */
    checkforCollision(collider1:BoxCollider, collider2:BoxCollider) {
        if (collider1.sides.left < collider2.sides.right && collider1.sides.right > collider2.sides.left && 
            collider1.sides.top < collider2.sides.bottom && collider1.sides.bottom > collider2.sides.top) {
                return true;

        }

        return false;
        
      



    }


    /**
     * @param {number} right distance from right side of the collider
     * @param {number} left distance from left side of the collider
     * @param {number} top distance from top side of the collider
     * @param {number} bottom distance from bottom side of the collider
     * @returns {string} returns the string, right, left, top, or bottom, that indicates the side of an object
     * that has collided with another object
     */
    sideOfCollision(right:number, left:number, top:number, bottom:number) :string{
        switch(Math.min(right, left, top, bottom)) {
            case right:
                return "right";
                
            case left:
                return "left";
                
            case top:
                return "top";
                
            case bottom:
                return "bottom";

            default:
                return "Error in Side of Collison"
                
        }
    }



    /**
     * empties the boxColliders currently observed by the collisionDataystem
     */
    reset(){
       this.dynamicGameObjects = [];
       this.staticGameObjects = [];
       
    }
    
    
    
    /////////////////////////////////////////////////////////////
    //
    // HELPER FUNCTIONS
    // 
    /////////////////////////////////////////////////////////////


    /**
     * resets the collsionList so no collsions are observed for the next object
     */
    clearList(){
        this.collisionList.right = false;
        this.collisionList.left = false;
        this.collisionList.top = false;
        this.collisionList.bottom = false;
        
    }

    didCollide(objectA:GameEntity, objectB:GameEntity){
        if (objectB.enabled()){
            this.checkCount += 1;
            if (objectA != objectB && this.checkforCollision(objectA.getBoxCollider()!, objectB.getBoxCollider()!)){
                this.emmitCollisionEvent(objectA, objectB);
            }
        }
    }
    


    






    /////////////////////////////////////////////////////////////
    //
    // ERROR/PERFORMANCE DETECTION
    // 
    /////////////////////////////////////////////////////////////


    
    checkPerformance(){
        if (this.performanceCheck){
            console.log("COLLISION-SYSTEM PERFORMANCE: ")
            console.log("->Number of Checks Per Frame: " + this.checkCount);

            this.performanceCheck = false;
            setTimeout(() => {
                this.performanceCheck = true;
            }, 5000);
        }
    }


} export default CollisionSystem