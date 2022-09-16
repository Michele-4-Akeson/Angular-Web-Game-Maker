import Animation from "../GameComponents/Animation"
import BoxCollider from "../GameComponents/BoxCollider"
import BoxTrigger from "../GameComponents/BoxTrigger"
import Transform from "../GameComponents/Transform"

interface GameEntity{
    update():void


    updatePosition(xref:number, yref:number):void

    /**
     * returns the Transform object of a game Entity
     */
    getTransform():Transform

    /**
     * returns the BoxCollider object of a game Entity
     */
    getBoxCollider(): BoxCollider | null

    setBoxCollider(boxCollider:BoxCollider|null):void

    /**
     * returns the Animation object of a game Entity
     */
    getAnimation():Animation | null

    /**
     * sets the animation of a gameEntity
     */
    setAnimation(animation:Animation|null):void

    /**
     *  checks if gameEntity has an animation object that is active, and if so,
     *  sets the animation to be the given 'direction'/frame
     */
    goTo(direction:string):void

    /**
     * returns the BoxTrigger object of a game Entity
     */
    getBoxTrigger():BoxTrigger | null

    setBoxTrigger(trigger:BoxTrigger | null):void

    /**
     * returns the Tag of a game Entity
     */
    getTag():String

    getOnScreen():boolean
    getActive():boolean

    /**
     * returns true if the gameEntity is both onScreen and active
     */
    enabled():boolean

   


    /**
     * Called by a GameEntity if game object's boxCollider collided
     * with another game object's boxCollider
     */
    collisionEvent(gameObject: GameEntity) : void

     /**
     * Called by a GameEntity if game object's boxTrigger collided
     * with another game object's boxCollider
     */
    triggerEvent(gameObject:GameEntity): void


     /**
     * Called by a GameManager to pass input events to subscribed gameEntities
     */
    inputEvent(event:String):void

    /**
     * returns a list of all children gameEntities of a gameObject
     */
    getChildren() : GameEntity[]

    
    /**
     * adds a gameEntity as a child of a gameObject
     */
    addChild(gameEntity : GameEntity) : void
   
    setOnScreen(state:boolean):void

    setActive(state:boolean) : void

    
} export default GameEntity