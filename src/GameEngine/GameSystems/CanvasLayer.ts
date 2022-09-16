import { of } from "rxjs";
import GameEntity from "../Interfaces/GameEntity";


/**
 * the canvasLayer class stores the refernece to the html canvas element. This class
 * functions to display gameObjects on the canvas at their relatvie position in the 
 * canvas, as determined by where they are the view of the camera
 * 
 * @param {HTMLCanvasElement} canvas the canvas element used to draw images on this layer
 * @property {HTMLCanvasElement} canvas the canvas element used to draw images on this layer
 * @property {CanvasContext} drawer property of canvas that allows us to draw on canvas
 * @property {Array<GameObject} layerObjects an array of gameObjects to be drawn on this layer
 */
class CanvasLayer{
  canvas : HTMLCanvasElement
  drawer : any
  offset:number = 30

  // Objects to draw in layer
  layerObjects : GameEntity[]
    constructor(canvas:HTMLCanvasElement){
      // Canvas Element
      this.canvas = canvas
      // Canvas Context: Handles rendering of sprites
      // ImageSmootingEnabled = False -> handles pixalation better 
      this.drawer = this.canvas.getContext("2d");
      this.drawer.imageSmoothingEnabled = false;
 

      // Canvas Attributes
      this.resize()

      // Objects to draw in layer
      this.layerObjects = [];


  }

  /**
   * resets the canvas such that no sprite is drawn. This method is used 
   * to help continuously redraw every frame
   */
  clear(){ 
      this.drawer.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  /**
   * adds a GameObject to the array of objects to be drawn in this
   * layer, layerObjects
   * @param {GameObject} object the object to be drawn in this layer
   */
  addObject(object:GameEntity) {
      this.layerObjects.push(object);
  }


  /**
   * draws a gameObject, object, to the canvas, 
   * @param {GameObject} object the object to be drawn in this layer 
   */
  draw(object:GameEntity){
      /*
      ctx.drawImage(image, src_x, src_y, crop_Width, crop_Height, dx, dy, dWidth, dHeight); \\
      This method draws an image to the canvas of size dwidth x dheight, however, the image is cropped
      prior to being drawn, where cropping beings at src_x and src_y, and only crop_wdith and crop_height
      are kept -- how we achieve animation feature
      */

     //console.log(object)
     const animation = object.getAnimation()!
     const transform = object.getTransform()!
     this.drawer.drawImage(animation.sprite, animation.getFrameX(), animation.getFrameY(), animation.frameSizeX, 
                            animation.frameSizeY, transform.getPositionX(), transform.getPositionY(), transform.getSize(), transform.getSize());
     
      
  }


  


  /**
   * is called when the window changes the size - this method rezies the canvas object to be equal to the new window size, minus 25 pixels
   */
  resize(){
    this.canvas.width = this.canvas.parentElement!.getBoundingClientRect().width - this.offset;
    this.canvas.height = this.canvas.parentElement!.getBoundingClientRect().height - this.offset;
  }


  /**
   * empties all currently observed gameObjects in layerObjects
   */
  reset(){
    this.layerObjects = [];
  }




  




} export default CanvasLayer