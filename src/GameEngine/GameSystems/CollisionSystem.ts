
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
  

    collisionList : CollisonData
    performanceCheck : boolean
    checkCount : number
    constructor(){
        this.playerCollider = null
        this.dynamicGameObjects = [];
        this.staticGameObjects = [];
      
        this.collisionList = {right: false, left: false, top: false, bottom: false};
        
        this.performanceCheck = false;
        this.checkCount = 0;
        
    }


    /**
     * adds all GameObjects with BoxColliders to either dynamicGameObjects (if 
     * gameObject moves) and staticGameObjects (if gameObject does not move), 
     * and then recursively adds all children of an object
     * @param {Array<GameObject>} objects an array of GameObjects 
     */
    addGameObjects(objects:(GameEntity|null)[]){
        for (let object of objects){
            if (object){
                if (object.getBoxCollider() != null) {
                    if (object.getBoxCollider()?.dynmaic) {
                        this.dynamicGameObjects.push(object)

                    } else {
                        this.staticGameObjects.push(object);

                    }
                }

                this.addGameObjects(object.getChildren())

            }


        }

    }





    /**
     * iterates through all GameObjects in dynamicGameObjects and determines if a collision occurs between
     * two or more objects. If a collision occurs, the BoxCollider component of each object is update
     * 
     * Note: dynamicGameObjects are compared with all other GameObjects, however, staticGameObjects are not compared
     * as only dynamicGameObjects will ever move, and change the BoxCollider data of objects
     */
    update(){
        this.checkCount = 0;

        for (let objectA of this.dynamicGameObjects){
           this.clearList()

            if (objectA.enabled()){
                console.log(objectA.getTag())
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
     * updates the collision data of each BoxCollider, collider1, and collider2, with fields
     * such as the tag of the object which it collided with, and the side that collision occured
     * 
     * NOTE: Change Made - boxColliders now have an "activeSides" field such that if a side isn't
     * active, if a collision occurs on that side, it will not update the opposing object it collided 
     * with
     * @param {BoxCollider} collider1 
     * @param {BoxCollider} collider2 
     */
    updateCollisionData(collider1:BoxCollider, collider2:BoxCollider){
     
        // the side of collider1 that collided with collider2 -- if c1 collided with c2 left side, the right side of c1 is returned
        // as it's the side that made the collison
        const side = this.getSideOfCollision(collider1, collider2)
        if (collider1.canSideCollide(side)){
            switch(side){
                case "right":
                    if (collider2.canSideCollide("left")){
                        collider1.collisionData.right = true;
                        collider2.collisionData.left = true;
                        this.collisionList.right = true;    
                    }

                    break;
                case "left":
                    if (collider2.canSideCollide("right")){
                        collider1.collisionData.left = true;
                        collider2.collisionData.right = true;
                        this.collisionList.left = true;
                    }
               
                    break;
                case "top":
                    if (collider2.canSideCollide("bottom")){
                        collider1.collisionData.top = true;
                        collider2.collisionData.bottom = true;
                        this.collisionList.top = true;
                    }
                    
                    break;
                case "bottom":
                    if (collider2.canSideCollide("top")){
                        collider1.collisionData.bottom = true;
                    collider2.collisionData.top = true;
                    this.collisionList.bottom = true; 
                    }
                      
            } 
    

        }

    


    }



    didCollide(objectA:GameEntity, objectB:GameEntity){
        if (objectB.enabled()){
            this.checkCount += 1;
            if (objectA != objectB && this.isOverlapping(objectA.getBoxCollider()!, objectB.getBoxCollider()!)){
                this.emmitCollisionEvent(objectA, objectB);
            }
        }
    }
    

    /**
     * returns true if the sides of collider1 and collider2 are overlapping/intersecting, such
     * that the positions of each side are within the bounds of another
     * @param {BoxCollider} collider1 
     * @param {BoxCollider} collider2 
     * @returns true if the sides of collider1 is intersects with the sides of collider2
     */
    isOverlapping(collider1:BoxCollider, collider2:BoxCollider) {
        if (collider1.sides.left < collider2.sides.right && collider1.sides.right > collider2.sides.left && 
            collider1.sides.top < collider2.sides.bottom && collider1.sides.bottom > collider2.sides.top) {
                return true;

        }

        return false;


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
     * calculates the distance of active sides of both opposing (i.e right-left)
     * of two colliders and returns the side of collider1 which is colliding with colider2
     * @param collider1 boxCollider of object1
     * @param collider2 boxCollider of Object2
     * @returns a string of right, left, top, bottom, indicating the side of collider1
     * that collided with collider2
     */
    getSideOfCollision(collider1:BoxCollider, collider2:BoxCollider):string{
        // the distances between sides of each collider
        const distRL = Math.abs(collider1.sides.right - collider2.sides.left);//distance from c1's right side to c2's left side
        const distLR = Math.abs(collider1.sides.left - collider2.sides.right);//distance from c1's left side to c2's right side   
        const distTB = Math.abs(collider1.sides.top - collider2.sides.bottom);//distance from c1's top side to c2's bottom side 
        const distBT = Math.abs(collider1.sides.bottom - collider2.sides.top);//distance from c1's bottom side to c2's top side

        switch(Math.min(distRL, distLR, distTB, distBT)){
            case distRL:
                return "right"
            case distLR:
                return "left"
            case distTB:
                return "top"
            case distBT:
                return "bottom"
            default:
                console.log("error - no side returned in getSideOfCollision()")
                return ""
        }
    
    }



    
    
    
    /////////////////////////////////////////////////////////////
    //
    // HELPER FUNCTIONS
    // 
    /////////////////////////////////////////////////////////////

    
    /**
     * empties the boxColliders currently observed by the collisionDataystem
     */
    reset(){
        this.dynamicGameObjects = [];
        this.staticGameObjects = [];
        
     }


    /**
     * resets the collsionList so no collsions are observed for the next object
     */
    clearList(){
        this.collisionList.right = false;
        this.collisionList.left = false;
        this.collisionList.top = false;
        this.collisionList.bottom = false;
        
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