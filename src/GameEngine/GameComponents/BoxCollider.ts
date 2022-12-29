import { BoxColliderData } from "../Interfaces/BoxColliderData"
import GameEntity from "../Interfaces/GameEntity"


interface SideData{
    top:number, bottom:number, left:number, right:number
}

interface CollisionData {
    gameObject:GameEntity | null, collisionTag:String, left:boolean, right:boolean, top:boolean, bottom:boolean
}



/**
 * The BoxCollider class stores the BoxCollider data of a given an object. This refers to the x, y position of
 * that object, as well as its size. This Object also stores the current state of it's gameObject's collisions:
 *      - What object(s) its currently colliding with
 *      - What sides are colliding with another object 
 * @param {number} size the width and height of the boxCollider
 * @param {boolean} dynamic indicates if the gameObject of the boxCollider moves or is static
 * @property {number} x the x position of the gameObject's boxCollider relative to its load position
 * @property {number} y the y position of the gameObject's boxCollider relative to its load position
 * @property {number} size the width and height of the boxCollider
 * @property {boolean} dynamic if the gameObject of the boxCollider moves or is static -- false by default
 * @property {boolean} active indicates if boxCollider is active
 * @property {object} sides an js object storing coordinate data for each side of the boxCollider
 * @property {object} collisionData an js object storing the data describing the collisons of the boxCollider
 * 
 */



class BoxCollider{
    x : number
    y : number
    size : number
    dynmaic : boolean
    onScreen : boolean
    active : boolean
    sides : SideData
    collisionData : CollisionData
    activeSides: { top: boolean, bottom: boolean, left: boolean, right: boolean }

    constructor(size:number) {
        // defines the coordinates of an objects boxcollider
        // note: should test if this.x is a constant value, or a reference to a value that changes - thus updates on it's own?? -- does not appear to be the case

        // BoxCollider checks are likely to most performance costly aspect of the game loop's animation frame
        // Idea: create a GameObject that acts just as a long (horizonatl or vertical) boxCollider (width x n / height x n)
        // which would limit the total number of BoxColliders required -- limits reduntdant checks for perimeter block: Boundry class - which would be overlayed in the mainground or foreground
        this.x = 0;
        this.y = 0;
        this.size = size;
        this.dynmaic = false;
        this.onScreen = false;
        this.active = true;
        this.sides = { top: this.y, bottom: this.y + size, left: this.x, right: this.x + size}
        this.activeSides = {top: true, bottom: true, left: true, right: true}
        this.collisionData = { gameObject: null, collisionTag: "none", left: false, right: false, top: false, bottom: false };
        


    }

    /**
     * updates the position of the BoxCollider, including its vertex/side positions
     * @param {number} x the x-coordinate the boxCollider is located relative to its gameObject 
     * @param {number} y the y-coordinate the boxCollider is located relative to its gameObject 
     */
    update(x:number, y:number) {
        this.x = x;
        this.y = y;
        this.sides.top = y;
        this.sides.bottom = y + this.size;
        this.sides.left = x;
        this.sides.right = x + this.size;

    }



    /**
     *sets the size of the BoxCollider, being a square with side length, size
     * @param {number} size the width and height the boxCollider will be updated to
     */
    setSize(size:number) {
        this.size = size;
        this.sides = { top: this.y, bottom: this.y + size, left: this.x, right: this.x + size}
    }


    setActive(state:boolean){
        this.setNoCollision();
        this.active = state;

    }



    /**
     * resets the BoxCollider collisionData field to have no applied collisions
     */
    setNoCollision(){
        this.collisionData.gameObject = null;
        this.collisionData.collisionTag = "none";
        this.collisionData.left = false;
        this.collisionData.right = false;
        this.collisionData.top = false;
        this.collisionData.bottom = false;
        

    }


    /**
     * updates the BoxCollider with the object that a collisioin is occuring with
     * and the tag assoicated 
     * @param {GameObject} object the gameObject being collided with
     */
    updateCollision(object:GameEntity){
        this.collisionData.gameObject = object;
        this.collisionData.collisionTag = object.getTag();
        //console.log(object.tag)
    }



    /**
     * updates the sides in which the BoxCollider has a collision - it 
     * allows for more than one side of collision detection, and update if a collision on a
     * side is no longer taking place
     * @param {object} collisionsList a js object describing a collision with an object
     */
    checkCollisions(collisionsList:{top:boolean, right:boolean, left:boolean, bottom:boolean}){
        if (!collisionsList.right) {
            this.collisionData.right = false;
        }
        
        if (!collisionsList.left){
           this.collisionData.left = false;
        }
        
        if (!collisionsList.top){
           this.collisionData.top = false;
        } 
        
        if (!collisionsList.bottom){
           this.collisionData.bottom = false;
        }

        let count = 0;
        let key :keyof typeof collisionsList
        for (key in collisionsList){
            if (collisionsList[key]){
                count+=1
            }
        }
        

        if (count == 0){
            this.setNoCollision();

        }
    }

    /**
     * checks if there is a collision on a given side (left, right, up, down)
     * @param side the direction/side to be checked for an exsisting collision
     * @returns true if a boxCollider has a collision in the respective direction being checked
     */
    sideHasCollision(side:string):boolean{
        switch(side){
            case "left":
                return this.collisionData.left
            case "right":
                return this.collisionData.right
            case "up":
                return this.collisionData.top
            case "down":
                return this.collisionData.bottom
            default:
                console.log("typo in collision - " + side)
                return false
        }


    }


    setActiveSides(data:BoxColliderData){
        this.activeSides.left = data.left
        this.activeSides.right = data.right
        this.activeSides.top = data.top
        this.activeSides.bottom = data.bottom
    }

    /**
     * checks if a given side of a boxCollider is active; if it is,
     * then it can be collided with
     * @param side the side of the boxCollider
     * @returns true if the side given can be collided with
     */
    canSideCollide(side:string):boolean{
        switch(side){
            case "left":
                return this.activeSides.left
            case "right":
                return this.activeSides.right
            case "top":
                return this.activeSides.top
            case "bottom":
                return this.activeSides.bottom
            default:
                console.log("typo in collision - " + side)
                return false
        }
        
    }
    


} export default BoxCollider