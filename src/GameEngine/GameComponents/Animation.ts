
/**
 * Stores the animation data of an object. This refers to the number of animation frames
 * a specific sprite asset of a gameObject contains (based on its spritesheet), the size of those frames, the speed of animation
 * as well as the current frame of animation an object has. The animation object can be set to active=true or 
 * active=false to control whether the object should be animated through the frames of its spritesheet
 * @param {Spritesheet} spritesheet The spritesheet asset - See {@link Spritesheet}
 * @param {number} startx  the x-coordinate the animation should start at
 * @param {number} starty the y-coordinate the animation should start at
 * @param {number} speed a value of 1-10, where 1 is the fastest animation speed, and 10 is the slowest
 * @param {boolean} active whether animation is active for the object
 * @property {HTMLImageElement} sprite image asset used by canvas to draw
 * @property {number} frameSizeX size of the crop frame the canvas will use to draw a portion of the image
 * @property {number} frameSizeY size of the crop frame the canvas will use to draw a portion of the image
 * @property {number} xframe the current column the animation is located in the spritesheet
 * @property {number} yframe the current row the animation is located in the spritesheet
 * @property {bool} active the state of the animation
 * @property {number} speed of 1-10, where 1 is the fastest animation speed, and 10 is the slowest
 * @property {bool} pairedAnimation
 * @property {bool} pairedEndingAnimation
 * @property {number} previousFrameY
 * @property {bool} previousActiveState
 */

import Spritesheet from "./Spritesheet"



class Animation {
    sprite : HTMLImageElement
    frameSizeX : number
    frameSizeY : number
    xframes : number
    yframes : number
    currentFrameX : number
    currentFrameY : number
    active : boolean
    visible : boolean
    speed : number

    callFunction : Function | null
    pairedAnimation : boolean
    pairedEndingAnimation : boolean

    triggeredAnimation : boolean
    triggeredEndAnimation : boolean
    previousFrameY : number
    previousActiveState : boolean

    left:number = 0
    right:number = 0
    up:number = 0
    down:number = 0

    constructor(spritesheet:Spritesheet, startx:number, starty:number, speed:number, active:boolean) {
        this.sprite = spritesheet.sprite;
        this.frameSizeX = spritesheet.imageWidth / spritesheet.columns;
        this.frameSizeY = spritesheet.imageHeight / spritesheet.rows;
        this.xframes = spritesheet.columns;
        this.yframes = spritesheet.rows;
        this.currentFrameX = startx;
        this.currentFrameY = starty;
        this.active = active; // if an animation is not active (active = false), the animation will not play
        this.speed = speed; 
        this.visible = true  

        this.callFunction = null

        this.pairedAnimation = false;
        this.pairedEndingAnimation = false;

        this.triggeredAnimation = false;
        this.triggeredEndAnimation = false;

        this.previousFrameY = 0;
        this.previousActiveState = false;

    }




    /////////////////////////////////////////
    // GET METHODS
    /////////////////////////////////////////
    /**
     * @returns {number} the x position at which the canvas drawer will 
     * start cropping to achieve frame animation
     */
    getFrameX() {

        return (this.currentFrameX * this.frameSizeX);

    }


    /**
     * @returns {number} the y position at which the canvas drawer will start cropping to achieve frame animation 
     */
    getFrameY() {

        return (this.currentFrameY * this.frameSizeY);

    }



    /////////////////////////////////////////////
    // ANIMATION METHODS
    /////////////////////////////////////////////
    /**
     * checks to see if the current frame of animation is 
     * greater than the last frame in a row, and if so, sets the current 
     * frame to 0 of that row (restarting the animation loop)
     */
    loopAnimation() {
        if (this.currentFrameX >= this.xframes) {
            this.currentFrameX = 0;
        }
    }



    /**
     * increments an animation frame one frame to the left
     * of a spritesheet and loops to the first frame in the row of the spritesheet
     * if currentFrameX exceeds the number of avaiable frames horizontally 
     */
    stepAnimation() {
        this.currentFrameX += 1;
        this.loopAnimation();
    }


    /**
     * sets the gameObject's visibility
     * @param {boolean} state indicates if object is visible
     */
    setVisible(state:boolean){
        this.visible = state;
    }



    setDirectionalFrames(left:number, right:number, up:number, down:number){
        this.left = left
        this.right = right
        this.up = up
        this.down = down
    }


    setDirection(direction:string){
        if (!this.isRunningAnimation()){
            switch(direction){
                case "left":
                    this.currentFrameY = this.left
                    break
                case "right":
                    this.currentFrameY = this.right
                    break
                case "up":
                    this.currentFrameY = this.up
                    break
                case "down":
                    this.currentFrameY = this.down
                    break
                case "stop":
                    this.currentFrameX = 0
                    break
                default:
                    this.currentFrameX = 0
            }
        }
       
    }












    ///////////////////////////////////////////////////////////////
    // CONTROLLED ANIMATIONS
    //////////////////////////////////////////////////////////////


    isRunningAnimation(){
        return this.pairedAnimation || this.pairedEndingAnimation || this.triggeredAnimation || this.triggeredEndAnimation
    }

    /**
     * sets the animation to run through a specified animation starting at the 
     * given row in the spritesheet, newFrame, for a single cycle
     * @param {number} newFrame a y frame (row in the spritesheet) 
     */
    startTriggeredAnimation(newFrame:number){
        this.previousActiveState = this.active;
        this.previousFrameY = this.currentFrameY;
        this.currentFrameX = 0;
        this.currentFrameY = newFrame;

        this.active = true;
        this.triggeredAnimation = true;


    }

    /**
     * steps the current animation horizontally through the spritesheet until reaching the end of an animation, 
     * and then sets the animation to its previoius animation frame upon completeion of the cycle 
     * starting at the given yFrame (row)
     */
    runTriggeredAnimation(){
       
        this.currentFrameX += 1;
        
        if (this.currentFrameX >= this.xframes) {
            this.triggeredAnimation = false;
            this.currentFrameY = this.previousFrameY;
            this.active = this.previousActiveState;
            this.currentFrameX = 0;
        }

    }


    /**
     * sets the animation to run through a specified
     * animation starting at the given row, newFrame, for a single cycle, where it will
     * remain on the final animation frame of that row on completion
     * @param {number} newFrame a y frame (row in the spritesheet) 
     */
    startEndingAnimation(newFrame:number){
        this.currentFrameX = 0;
        this.currentFrameY = newFrame;

        this.active = true;
        this.triggeredEndAnimation = true;


    }


    /**
     * steps the current animation a single frame horizontally
     * and sets the animation to false on the last frame such that the animation remains on
     * the last frame in that row
     */
    runEndingAnimation(){
        this.currentFrameX += 1; 
        if (this.currentFrameX == this.xframes - 1) {
            this.active = false;
            this.triggeredEndAnimation = false;
            
        }

    }


    /**
     * sets the animation to run through a specified
     * animation starting at the given frame, newFrame, for a single cycle, 
     * and pairs a function, callFunction, to be executed on completeion of the animation

     * @param {number} newFrame a y frame (row in the spritesheet) 
     * @param {Function} callFunction a arrow function that will be called when the animation finishes (ex. ()=>{myFunction()})
     */
    startPairedAnimation(newFrame:number, callFunction:Function) {
    
        this.previousActiveState = this.active;
        this.previousFrameY = this.currentFrameY;
        this.currentFrameX = 0;
        this.currentFrameY = newFrame;

        this.active = true;
        this.pairedAnimation = true;
        this.callFunction = function() {
            callFunction();
            
        }
    }


    /**
     * steps the current animation a single frame horizontally
     * and executes the paired callFunction upon completeion of the animation and sets
     * the animation state and frame to it's previous state
     */
    runPairedAnimation(){
        this.currentFrameX += 1;
        
        if (this.currentFrameX >= this.xframes) {
            this.pairedAnimation = false;
            this.currentFrameY = this.previousFrameY;
            this.active = this.previousActiveState;
            this.currentFrameX = 0;
            this.attempCallFunction()
            this.callFunction = null;
            
        }
        

    }




    /**
     * sets the animation to run through a specified
     * animation starting at the given frame, newFrame, for a single cycle, and pairs
     * a function, callFunction, to be executed on completeion of the animation
     * @param {number} newFrame a y frame (row of the spritesheet)
     * @param {Function} callFunction an arrow function that will be called after the animation finishes (ex. ()=>{youFunction()}) 
     */
    startPairedEndingAnimation(newFrame:number, callFunction:Function) {
        this.currentFrameX = 0;
        this.currentFrameY = newFrame;

        this.active = true;
        this.pairedEndingAnimation = true;
        this.callFunction = function() {
            callFunction();
            
        }



    }



    attempCallFunction(){
        if (this.callFunction){
            this.callFunction()
        }
    }


    /**
     * runPairedAnimation() steps the current animation a single frame horizontally
     * and executes the paired "callFunction" upon completeion of the animation and sets
     * the animation state and frame to it's previous state
     */
    runPairedEndingAnimation(){
        this.currentFrameX += 1;
        
        if (this.currentFrameX == this.xframes - 1) {
            this.pairedEndingAnimation = false;
            this.active = false;
            this.attempCallFunction()
            this.callFunction = null;
            
        }
        

    }


   

} export default Animation
