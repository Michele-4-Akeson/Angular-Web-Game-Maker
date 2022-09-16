
import GameObject from "../GameObjects/GameObject.js";
import GameEntity from "../Interfaces/GameEntity.js";
import { Map } from "../Interfaces/Map.js";
import { Sides } from "../Interfaces/Sides.js";




/**
 * This class defines the camera object which is responsible for determining what is displayed on
 * each HTML canvas layer. This is achieved by providing a set view boundries in pixels. These view 
 * boundries are converted to a scaled unit based on the scale of the game map, and in effect
 * indicates what tile to draw of our grame map:
 * This approach is being updated such that the camera indicates what objects are currently on screen,
 * and setting those objects to be active.
 * This information is relayed to the graphics system and the respective canvas layer, which draws each active object
 *
 * Example: 
 * if our camera object has vertices: (0, 0), (320, 0), (0, 320), (320, 320)
 * We essentially create a sqaure camera where each side is 320 pixels in length
 * With this, if we had a tile map that was scaled such that each tile was 32 pixels
 * -- we could divide each pixel coordinate within the camera bounds by the scale
 * such that: at (160, 0), we are drawing the tile in the 5th column in row zero
 * 160 pixel / 32 pixel = 5
 * 0 pixel / 32 pixel = 0
 * 
 * @param {number} width the width of the camera 
 * @param {number} height the height of the camera
 * 
 * @property {number} x x-coordinate of camera
 * @property {number} y y-coordinate of camera
 * @property {number} width width of camera
 * @property {number} height height of camera
 * @property {boolean} following the camera following state
 * @property {GameObject} target the target the camera is following
 * @property {number} scale the scale of the game level in pixels
 * @property {number} previousX the previous x-coordinate of the gameObject being followed
 * @property {number} previousY the previous y-coordinate of the gameObject being followed
 * @property {number} centerX the x-coordinate center of the camera
 * @property {number} centerY the y-coordinate center of the camera
 * @property {object} map the map object with gameObjects and their positions in the canavas
 * @property {object} view the object describing the view of the camera (ex. width, height, left side, right side...)
 *      
 */
class Camera {
    // creates a camera object which defines 
    // the area in which graphics are rendered, and updates 
    // this area based on game logic - allows for larger and dynamic map size
    x : number
    y : number
    width : number
    height : number
    following : boolean
    target : GameEntity | null
    scale : number
    previousX : number
    previousY : number
    centerX : number
    centerY : number
    map : Map | null
    view : Sides

    constructor(width:number, height:number) {
        // creates a camera object which defines 
        // the area in which graphics are rendered, and updates 
        // this area based on game logic - allows for larger and dynamic map size
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.following = false;
        this.target = null
        this.scale = 0
        this.previousX = 0;
        this.previousY = 0;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.map = null
        this.view = { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };

    }

    /**
     * resets the bounds of the camera view based on its current x, y position
     */
    setCameraView() {
        this.view.left = this.x;
        this.view.right = this.x + this.width;
        this.view.top = this.y;
        this.view.bottom = this.y + this.height;
        
    }


    /**
     * sets the x and y coorindates of the camera object, and updates 
     * what the width and height of the camera is - this changes what is viewed on the canvas layers
         
     * @param {number} x 
     * @param {number} y 
     */
    setCamera(x:number, y:number) {
        this.x = x;
        this.y = y;
        this.setCameraView();
        
       

        
    }


    /**
     * iterates through the objectArray, map, in search for the given object, target.
     * Upon location of the desired object -- (should typically be the player) -- the 
     * function will calculate where that object is located within the given map, and 
     * set the inital position of camera to be centered around that object
     * -> centered around the object should be calculated as:
     * camera x = (cameraWidth / 2) "left of object"
     * camera y = (cameraHeight /2)  "above object"
     * The camera's state will be set to follow the object, target, such that it remains centered
     * around that object
     * @param {object} map 
     * @param {GameObject} target 
     */
    setToFollow(map:Map, target:GameEntity | null) {
  
        // Allows for iteration over every element in the map
        // while keeping their relative position in that map
       
        let x_min = 0
        let y_min = 0;
        let x_max = map.columns; 
        let y_max = map.rows; 
        this.scale = map.scale;
        this.map = map;

        

    
        let object;


        // sets all objects in view to active
        for (let x = x_min; x < x_max; x++) {
            for (let y = y_min; y < y_max; y++) {
                object = map.mainground[(y * map.columns) + x];// Object located at relative map location
    
                if (object == target) {
                
                    this.target = target;
                    this.following = true;
                    
                    this.setCamera(x * map.scale - this.centerX, y * map.scale - this.centerY);
                    target?.getTransform().setRef(x * map.scale - this.view.left,  y * map.scale - this.view.top)
                }
            }
        }

    } 



    /**
     * moves the camera's x and y position by the change of the targets position
     * from its previous position, keeping the camera centered around the target
     */
    follow() {
        if (this.following){
            const transform = this.target?.getTransform()
            const x = transform!.getX()
            const y = transform!.getY()
            if (this.previousX != x || this.previousY != y){
                this.x += (x - this.previousX) * this.scale;
                this.y += (y - this.previousY) * this.scale;
                this.previousX = x;
                this.previousY = y;
                this.setCameraView();
            }
            

        }
       
        
    }


    /**
     * called when the size of the window changes - this method resizes the Camera, and resets the camera to be
     * centered around the target object
     */
    adjustCamera() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

       
        
        this.setCameraView();
        this.setToFollow(this.map!, this.target);

       

    }



} export default Camera