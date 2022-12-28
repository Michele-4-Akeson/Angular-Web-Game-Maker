




declare var require: any
import GameEntity from "../Interfaces/GameEntity"
import { LevelData } from "../Interfaces/LevelData"
import { Map } from "../Interfaces/Map"
import { Subject } from "../Interfaces/Subject"
import { Subscriber } from "../Interfaces/Subscriber"
import AnimationSystem from "./AnimationSystem"
import Camera from "./Camera"
import CollisionSystem from "./CollisionSystem"
import GraphicsSystem from "./GraphicsSystem"
import LevelGenerator from "./LevelGenerator"
import TriggerSystem from "./TriggerSystem"
/**
 * This class defines the GameManager of the GameEngine which is responsible for:
 * 1. Determining which objects are active in-game based on logical aspects such as if they are visible by the Camera Object. 
 * 2. Calling the logic of every system (graphics, animation, collision) on every frame; allows objects to be drawn, animated, 
 * and receive collision data based on the current position and state of the gameObject
 * 3. Calling the update method of every GameObject on every frame such that they can perform their functionality (if any)             
 * 
 * @param {Array<HTMLCanvasElement>} canvasList an array of 3 html elements which will be used for rendering gameObjects animations
 * @property {LevelGenerator} LevelGenerator ~
 * @property {GraphicsSystem} graphicsSystem ~
 * @property {AnimationSystem} animationSystem ~
 * @property {Camera} camera ~
 * @property {triggerSystem} triggerSystem ~ 
 * @property {number} loadBuffer the addtional gridspaces to be loaded outside of the camera's view
 * @property {object} loadingArea an js object describing the area current loaded in the game
 * 
 */
class GameManager implements Subject {
    levelGenerator : LevelGenerator
    graphicsSystem : GraphicsSystem
    animationSystem : AnimationSystem
    collisionSystem : CollisionSystem
    triggerSystem : TriggerSystem
    camera : Camera
    loadedLevel : Map = {background:[], mainground: [], foreground:[], scale:0, columns:0, rows:0}
    player : GameEntity | null = null
    loadTarget : GameEntity | null = null
    loadBuffer : number = 8
    loadingArea : {x_min:number, x_max:number, y_min:number, y_max:number}
    errorCheck : boolean
    subscribers:Subscriber[] = []

    constructor(canvasList:HTMLCanvasElement[]) {
        this.levelGenerator = new LevelGenerator(this)
        this.graphicsSystem = new GraphicsSystem(canvasList);
        this.animationSystem = new AnimationSystem();
        this.collisionSystem = new CollisionSystem();
        this.triggerSystem = new TriggerSystem();
        this.camera = new Camera(this.graphicsSystem.mainground.canvas.width, this.graphicsSystem.mainground.canvas.height);
        this.loadBuffer = 8;
        this.loadingArea = {x_min:0, x_max:0, y_min:0, y_max:0};
        this.errorCheck = false;


        document.addEventListener("keydown", (e:KeyboardEvent)=>{
            this.updateSubscribers("keydown", e.key)
        })

        document.addEventListener("keyup", (e:KeyboardEvent)=>{
            this.updateSubscribers("keyup", e.key)
        })

    }
   

   

    //////////////////////////////////////////////////////////////////////
    //
    // UPDATE METHODS
    //
    //////////////////////////////////////////////////////////////////////

    /**
     * is called on every frame, an is used to update every system of the 
     * game as well as call object logic on every frame:
     * - graphicsSystem.update() redraws all GameObjects using updated position data of active objects in map
     * - animationSystem,animate() steps through all a frame of objects' animation
     * - collisionSystem().updateCollision() checks if a collision has occured between any objects in the game
     */
    update(){
        this.updateLoadingArea();
        this.deactivate()
        this.activate();


        this.updateGameObjects();
        this.collisionSystem.update();
        this.triggerSystem.update();
        this.graphicsSystem.update();
        this.animationSystem.update();
        this.camera.follow();

        if (this.errorCheck) this.errorDetection()
    
     
    }


    /**
     * calls the update() method of every gameObject allowing
     * for game-logic and events to occur
     */
    updateGameObjects(){
        for (let object of this.loadedLevel!.mainground){
            if (object != null && object.enabled()) {
                object.update();
            }
            
        }
    }


    /**
     * resets the observed objects by every system (graphics, animation, and collision)
     * and reloads observed objects with objects in currently loaded map
     */
    updateSystems(){
        this.graphicsSystem.reset();
        this.animationSystem.reset();
        this.collisionSystem.reset();


        this.graphicsSystem.addAll("background", this.loadedLevel!.background);
        this.graphicsSystem.addAll("mainground", this.loadedLevel!.mainground);
        this.graphicsSystem.addAll("foreground", this.loadedLevel!.foreground);

        this.animationSystem.addAnimations(this.loadedLevel!.background);
        this.animationSystem.addAnimations(this.loadedLevel!.mainground);
        this.animationSystem.addAnimations(this.loadedLevel!.foreground);

        this.collisionSystem.addGameObjects(this.loadedLevel!.background);
        this.collisionSystem.addGameObjects(this.loadedLevel!.mainground);

        this.triggerSystem.addGameObjects(this.loadedLevel!.mainground);

        if (this.player != null){
            this.camera.setToFollow(this.loadedLevel!, this.player)
        }

    }



    updateSubscribers(type:string, key:string): void {
        for (let sub of this.subscribers){
            sub.subjectUpdate(type, key)
        }
    }
    addSub(subscriber: Subscriber): void {
        this.subscribers.push(subscriber)
    }



    //////////////////////////////////////////////////////////////////////
    //
    // LOADING-AREA & OBJECT ACTIVATION
    //
    //////////////////////////////////////////////////////////////////////

    /**
     * sets all GameObjects currently in the loadingArea (view of the camera) to active
     */
    activate(){
        this.activateMap(this.loadedLevel!.background);
        this.activateMap(this.loadedLevel!.mainground);
        this.activateMap(this.loadedLevel!.foreground)
    }


    /**
     * sets all gameObjects which are currently "onScreen" to be onScreen and updates their positional data as needed
     * - If the gameObject is onScreen (visible by the camera), it will be stated as onScreen. 
     * - An object that is OnScreen is considered by the following systems:
     * 
     * 1. GraphicsSystem:  A gameObject that is both onScreen and Visible will be rendered to the Screen
     * 2. AnimationSystem: A gameObject that is both onScreen, and the animation component is active, will be stepped through its animation
     * 3. CollisionSystem: A gameObject that is both onScreen, and the boxCollider component is active will be checked for collisions
     * 4. GameManager: A gameObject that is both onScreen and active will be called to update 
     * @param {object} map a js object storing all game data to populate a level
     */
    activateMap(map:(GameEntity|null)[]){
        let object;
        for (let x = this.loadingArea.x_min; x < this.loadingArea.x_max; x++) {
            for (let y = this.loadingArea.y_min; y < this.loadingArea.y_max; y++) {
                // Object located at relative map location -- (column x, row y)
                object = map[y * this.loadedLevel!.columns + x];

                if (object != null) {
                    if (object != this.camera.target) {
                        object.setOnScreen(true)
                        object.updatePosition(Math.floor(x * this.loadedLevel!.scale - this.camera.view.left), Math.floor(y * this.loadedLevel!.scale - this.camera.view.top));
                    } else {
                        // Updates the target of the Camera
                        let positionX = object.getTransform().getPositionX()
                        let positionY = object.getTransform().getPositionY()
                        object.getBoxCollider()?.update(positionX, positionY)
                    }
                    
                   
                }
            }
        }

    }


    /**
     * sets all GameObjects to inactive - used on every frame to update active vs inactive objects
     */
    deactivate(){
        this.deactivateMap(this.loadedLevel!.background);
        this.deactivateMap(this.loadedLevel!.mainground);
        this.deactivateMap(this.loadedLevel!.foreground);

    }


    /**
     * sets all objects to be not "onScreen"/"inactive"
     * @param {object} map a js object storing all game data to populate a level
     */
    deactivateMap(map:(GameEntity|null)[]) {
        for (let object of map) {
            if (object != null && object != this.camera.target && object.getOnScreen()) {
                object.setOnScreen(false)
                
            }
        }

    }



    /**
     * uses the size of the camera to determine the area in which objects should be active or inactive: 
     * objects with positions within the loadingArea (in view by the camera) should be set to active, while objects outside
     * of this area should be set to inactive
     * - loadBuffer is provided to load GameObjets which are slightly out of view of the camera
        
     */
    updateLoadingArea(){
        // Converts what the camera object is viewing into the scaled units of the objectMap
        // The area being viewed by the camera is considered the loadingArea where objects in this area are rendered
        this.loadingArea.x_min = Math.floor(this.camera.view.left / this.loadedLevel!.scale) - this.loadBuffer;
        this.loadingArea.y_min = Math.floor(this.camera.view.top / this.loadedLevel!.scale) - this.loadBuffer;
        this.loadingArea.x_max = Math.ceil(this.camera.view.right / this.loadedLevel!.scale) + this.loadBuffer; // addtional columns to draw
        this.loadingArea.y_max = Math.ceil(this.camera.view.bottom / this.loadedLevel!.scale) + this.loadBuffer; // addtional rows to draw
    
        //The minimum and maximum (x, y) position of the loading area can't go eyond the boundaries
        //of the map which set as the number of columns and rows in the objectMap. 
        if (this.loadingArea.x_min < 0) this.loadingArea.x_min = 0;
        if (this.loadingArea.y_min < 0) this.loadingArea.y_min = 0;
        if (this.loadingArea.x_max > this.loadedLevel!.columns) this.loadingArea.x_max = this.loadedLevel!.columns;
        if (this.loadingArea.y_max > this.loadedLevel!.rows) this.loadingArea.y_max = this.loadedLevel!.rows;

    }





    /////////////////////////////////////////
    // LEVEL GENERATION
    /////////////////////////////////////////

    /**
     * sets the currently playing level to be the provided level - this will be loaded into all systems
     * @param {object} level the js object repersenting the level
     */
    setloadedLevel(level:Map){
        this.loadedLevel! = level
        if (this.player != null) this.player.getTransform().setSize(level.scale)
        this.updateSystems()
    }


    /**
     * generates a level using a .json file and sets it to be played
     * @param {string} jsonFile name of the .json file containing level data
     */
    



    /**
     * generates a level using a completed level object
     * @param {object} level the js object repersenting the level
     */
    loadLevel(level:LevelData){
        this.levelGenerator.build(level)
        this.player = this.levelGenerator.player
        console.log(this.player)
        this.setloadedLevel(this.levelGenerator.loadedLevel!);
        
    }

    resize(){
        this.graphicsSystem.adjustCanvas()
        this.camera.adjustCamera()
    }



    /*
    GRAPHICS-SYSTEM + ANIMATION-SYSTEM + COLLISION-SYSTEM
    */

    /////////////////////////////////////////////////////////////
    //
    // ERROR DETECTION
    // 
    /////////////////////////////////////////////////////////////


    errorDetection(){
        if (this.errorCheck){

            // PLAYER:
            console.log("PLAYER: ");
            console.log(this.player);
            console.log("\n");


            // CAMERA:
            console.log("CAMERA: ");
            console.log(this.camera);
            console.log("\n");


            // COLLISION-SYSTEM:
            console.log("COLLISION-SYSTEM: ")
            console.log(this.collisionSystem)
            console.log("\n");


            // ZONE-COLLISION-SYSTEM:
            console.log("ZONE-COLLISION-SYSTEM: ")
            console.log(this.triggerSystem)
            console.log("\n");


            

            // GRAPHICS-SYSTEM:
            console.log("GRAPHICS-SYSTEM: ")
            console.log(this.graphicsSystem)
            console.log("\n");


            // ANIMATION-SYSTEM:
            console.log("ANIMATION-SYSTEM: ")
            console.log(this.animationSystem)
            console.log("\n");




        }
    }


    



} export default GameManager



    




















