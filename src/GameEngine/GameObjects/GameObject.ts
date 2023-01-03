
import Animation from "../GameComponents/Animation"
import BoxCollider from "../GameComponents/BoxCollider"
import BoxTrigger from "../GameComponents/BoxTrigger"
import Transform from "../GameComponents/Transform"
import GameEntity from "../Interfaces/GameEntity"


/**
 * The GameObject class functions as the top level of inheritance for gameobjects
 * which appear in game. This will store fields which all gameobjects posses, such 
 * as position in game (x, y), sprite information(spritesheet, animation, etc..),
 * whether the object is currently active in game, the size of the gameobject
 * @param {number} size the width and height the gameObject takes up on the canvas
 * @param {boolean} state the active or inactive state of the gameObject
 * @param {boolean} dynamic indicates if the gameObject is moveable or static
 * @param {string} tag the string describing what the gameObject is
 * @property {number} size the width and height the gameObject takes up on the canvas
 * @property {Transform} transform the transform of a gameObject
 * @property {boolean} onScreen is the object on the screen
 * @property {boolean} active is the object active
 * @property {boolean} visibile is the object visible
 * @property {string} tag the string describing what the gameObject is
 * @property {BoxCollider | null} boxCollider the boxCollider of the gameObject - See {@link BoxCollider}
 * @property {Animation | null} animation the animation of the gameObject - See {@link Animation}
 * @property {BoxTrigger | null} boxTrigger the boxTrigger of the gameObject - See {@link BoxTrigger}
 */


class GameObject implements GameEntity{
    protected transform : Transform
    protected onScreen : boolean
    protected active : boolean
    protected tag : string
    protected animation : Animation | null
    protected boxCollider : BoxCollider | null
    protected boxTrigger : BoxTrigger | null
    protected children : GameEntity[]

    constructor(size:number, tag:string){
        this.transform = new Transform(0, 0, size)
        this.onScreen = true;
        this.active = true;
        this.tag = tag;
        this.animation = null
        this.boxCollider = new BoxCollider(size);
        this.boxTrigger = null
        this.children = [];

    }
   
 
 

  
  
  
   
    update(): void {
        
    }

    getTransform(): Transform {
        return this.transform
    }

    getBoxCollider(): BoxCollider | null {
        return this.boxCollider
    }

    setBoxCollider(boxCollider: BoxCollider | null): void {
        this.boxCollider = boxCollider
    }

    setDynmaic(state: boolean): void {
        if (this.boxCollider){
            this.boxCollider!.dynmaic = state
        }

        if (this.boxTrigger){
            this.boxTrigger.dynmaic = state
        }
    }

 

   
    getBoxTrigger(): BoxTrigger | null {
        return this.boxTrigger
    }

    getTag(): String {
        return this.tag
    }

    getChildren(): GameEntity[] {
        return this.children
    }

    collisionEvent(gameObject: GameEntity): void {
        
    }

    triggerEvent(gameObject: GameEntity): void {
        
    }

    inputEvent(event: String): void {
        
    }

    enabled(): boolean {
        return this.onScreen && this.active
    }

    getActive(): boolean {
        return this.active
    }

    getOnScreen(): boolean {
        return this.onScreen
    }
  
    setOnScreen(state: boolean) {
        this.onScreen = state
    }

    getAnimation(): Animation | null {
        return this.animation
    }
    setAnimation(animation: Animation | null): void {
        this.animation = animation
    }

    setBoxTrigger(trigger: BoxTrigger | null): void {
        this.boxTrigger = trigger
    }


    goTo(direction: string): void {
        if (this.getAnimation()?.active) this.getAnimation()?.setDirection(direction)
    }



 

    



    
    /////////////////////////////////////////////////
    //
    // SET METHODS
    //
    /////////////////////////////////////////////////

     /**
     * creates a new Animation and applies it to the field of the GameObject class
     * @param {spritesheet} spritesheet 
     * @param {number} startX 
     * @param {number} startY 
     * @param {number} speed 
     * @param {boolean} active 
     */
    
    /**
     * sets the size of the gameObject
     * @param {number} size the new size of the gameObject 
     */
    setSize(size:number){
        this.transform.setSize(size)
        this.boxCollider?.setSize(size)
    }



        

    /**
     * updates the gameObject with its new xref and yref position based on where the camera has moved.
     * This method updates the BoxCollider object with this new data such that the image, and boxCollider positions are 
     * overlayed
     
     * Note:  All children of this object will be called to update their transform based on the new xref and yref
     * @param {number} xref the x-coordinate of the position the object is on the canvas
     * @param {number} yref the y-coordinate of the position the object is on the canvas
     */
    updatePosition(xref: number, yref: number): void {
        if (this.active) {
            this.transform.setRef(xref, yref)

            this.updateBoxCollider();
            this.updateZoneCollider();
            
        }

     
      
    }


    /**
     * updates the position of the gameobject's BoxCollider(s) with the current xref, yref, and x and y positions 
     */
    updateBoxCollider(){
        if (this.boxCollider != null && this.boxCollider.active){
            this.boxCollider.update(this.transform.getPositionX(), this.transform.getPositionY())
        }
    }        


    /**
     * updates the position of the gameobject's ZoneCollider(s) with the current xref, yref, and x and y positions 
     */
    updateZoneCollider(){
        if  (this.boxTrigger != null && this.boxTrigger.active){
            this.boxTrigger.update(this.transform.getPositionX(), this.transform.getPositionY());
        }
    }


    /**
     *  calls the update method for all active children objects
     */
    updateChildren(){
        for (let child of this.children){
            if (child.getActive()){
                child.update();
            }
            
        }
    }



    //////////////////////////////////////////
    //
    // OTHER
    //
    //////////////////////////////////////////
 
   

   


    /**
     * sets all states of a GameObject to the true such that it rendered, animated, called to update, or considered 
     * for collision when onScreen
     */

     setActive(state: boolean) {
        this.active = state
        this.animation?.setVisible(state)
        this.boxCollider?.setActive(state)
        this.boxTrigger?.setActive(state)
    }
   
    
    


    /**
     * sets all states of a GameObject to the false such that it isn't rendered, animated, called to update, or considered 
     * for collision
     */
    destroy(){
        this.setActive(false)
        
    }

    
    /**
     * adds a childObejct to a gameObject
     * @param {GameEntity} child the child object to be added
     */
    addChild(child:GameEntity|null){
       if (child != null){
        this.children.push(child);
       }
       
    }

    /*
    toJSON() {
        return Object.getOwnPropertyNames(this).reduce((a, b) => {
          a[b] = this[b];
          return a;
        }, {});
    }
    */
    


    

    
} export default GameObject