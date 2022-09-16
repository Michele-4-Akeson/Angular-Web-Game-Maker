import Animation from "../GameComponents/Animation";
import GameEntity from "../Interfaces/GameEntity";


/**
 * The AnimationSystem class functions to control and run the animations of gameObjects,
 * taking into account speed, active state, and tag of object.
 * @property {Array<GameObject>} animatedObjects an array of all gameObjects with animations
 * @property {number} systemSpeed a parameter used for controlling the speed of animations
 * @property {boolean} active state of animation system: when true, animationsystem runs animations, when false, animation system does nothing
 */
 class AnimationSystem {
    animatedObjects : GameEntity[]
    systemSpeed : number
    active : boolean
    constructor() {
        this.animatedObjects = [];
        this.systemSpeed = 1;
        this.active = true;
    }


    /**
     * all gameobjects in gameObjects[] to animations[] 
     * @param {Array<GameObject>} gameobjects 
     */
    addAnimations(gameobjects:(GameEntity|null)[]) {
        for (let object of gameobjects) {
            if (object != null) {
                this.animatedObjects.push(object);
            }
        }
    }


    /**
     * iterates through every Animation object in animations[] and calls 
     * the associated animation function which increments to the next horizontal frame 
     * in the animation
     */
    update() {
        for (let object of this.animatedObjects) {
            this.animate(object.getAnimation()!);

            for (let child of object.getChildren()){
                this.animateChildren(child);
            }
                
        }

        this.systemSpeed += 1;

        if (this.systemSpeed > 10) {
            this.systemSpeed = 1;
        }
        

    }


    /**
     * animates a childObject, object, and recursivly animates all children of that
     * object and its children
     * @param {GameObject} object 
     */
    animateChildren(object:GameEntity){
            this.animate(object.getAnimation()!);

            for (let child of object.getChildren()){
                this.animateChildren(child);
            }
                
    }



    /**
     * handles the logic for when/how to step through a GameObjects animation
     * @param {Animation} animation 
     */
    animate(animation:Animation){
        if (animation.active && this.systemSpeed % animation.speed == 0) {

            if (animation.triggeredEndAnimation){
                animation.runEndingAnimation();
            } else if (animation.pairedEndingAnimation) {
                animation.runPairedEndingAnimation();
                
            } else if (animation.triggeredAnimation){
                animation.runTriggeredAnimation();
            } else if (animation.pairedAnimation){
                animation.runPairedAnimation();
            } else {
                animation.stepAnimation(); 

            }
           
        }

    }



    /**
     * removes all animated objects from the system such that no objects are being animated
     */
    reset(){
        this.animatedObjects = [];
    }


    



} export default AnimationSystem