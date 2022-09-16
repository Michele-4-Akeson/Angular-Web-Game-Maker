import GameEntity from "../Interfaces/GameEntity"
import CanvasLayer from "./CanvasLayer"


/**
 * The GraphicsSystem class functions to draw/render images on the HTML canvas element.
 * This class controls where images are rendered on these elements, as well as what canvas
 * layer the element is rendered on.
 * @param {Array<HTMLCanvasElement>} canvasList an array of HTML canvas elements used to render graphics of game
 * @property {CanvasLayer} background a layer in which graphics of gameObjects will be rendered
 * @property {CanvasLayer} mainground a layer in which graphics of gameObjects will be rendered
 * @property {CanvasLayer} foreground a layer in which graphics of gameObjects will be rendered

 */
class GraphicsSystem {
    background : CanvasLayer
    mainground : CanvasLayer
    foreground : CanvasLayer

    performanceCheck : boolean
    drawCount : number
    constructor(canvasList:HTMLCanvasElement[]) {
        console.log(canvasList)
        // Canvas Layers
        this.background = new CanvasLayer(canvasList[0]);
        this.mainground = new CanvasLayer(canvasList[1]);
        this.foreground = new CanvasLayer(canvasList[2]);

        this.performanceCheck = false;
        this.drawCount = 0;
    }


    /**
     * is called on every frame and updates the the gameview based 
     * on the provided position of objects and their states, allowing for animation 
     * to take place
     */
    update() {
        this.drawCount = 0;
        this.clearAll();


        // renders all gameObjects in background layer which are onScreen and visible
        this.drawLayer(this.background.layerObjects, "background")
        // renders all gameObjects in mainground layer which are onScreen and visible
        // renders all childObjects of the gameObject
        this.drawLayer(this.mainground.layerObjects, "mainground")


        this.checkPerformance();




    }

    drawable(object:GameEntity) :boolean | undefined{
        return object.enabled() && object.getAnimation()?.visible
            
    }

    


    



    ///////////////////////////////////////////////////////
    //
    // GAME-OBJECT ADDERS
    //
    ///////////////////////////////////////////////////////

    /**
     * appends a gameobject, object, to a layer list based on the string,
     * layer, which is either "background", "mainground", "foreground"
     * @param {string} layer the layer the gameObject will be rendered in: one of background, mainground, layer
     * @param {GameObject} gameObject the gameObject to be rendered in the specifed layer  
     */
    add(layer:string, gameObject:GameEntity) {
        switch (layer) {
            case "background":
                this.background.addObject(gameObject);
                
                break;
            case "mainground":
                this.mainground.addObject(gameObject);
                
                break;
            case "foreground":
                this.foreground.addObject(gameObject);
                break;

        }

    }


    /**
     * stores objects in a layer list based on the string, layer 
     * which is either "background", "mainground", "foreground"  
     * @param {string} layer the layer the gameObject will be rendered in: one of background, mainground, layer
     * @param {Array<GameObject>} gameObjects the gameObjects to be rendered in the specifed layer  
     */
    addAll(layer:string, gameObjects:(GameEntity|null)[]){
        switch (layer) {
            case "background":
                for (let object of gameObjects){
                    if (object != null) {
                        this.background.addObject(object);
                    }
                }
                
                break;
            case "mainground":
                for (let object of gameObjects){
                    if (object != null) {
                        this.mainground.addObject(object);
                        
                    }
                }

                break;

            default:


        }

       

    }





    ///////////////////////////////////////////////////////
    //
    // DRAWING
    //
    ///////////////////////////////////////////////////////

    /**
     * calls the canvas drawer object to draw a given
     * object within the repective layer
     * @param {string} layer the layer the gameObject will be rendered in: one of background, mainground, layer
     * @param {GameObject} gameObject the gameObject to be rendered in the specifed layer  
     */
    draw(layer:string, gameObject:GameEntity) {
        /*
         * ctx.drawImage(image, src_x, src_y, crop_Width, crop_Height, dx, dy, dWidth, dHeight); \\
         * This method draws an image to the canvas of size dwidth x dheight, however, the image is cropped
         *  prior to being drawn, where cropping beings at src_x and src_y, and only crop_wdith and crop_height
         *  are kept -- how we achieve animation
         *
         */

        this.drawCount += 1;

        switch (layer) {
            case "background":
                this.background.draw(gameObject);
                break;
            case "mainground":
                this.mainground.draw(gameObject);
                break;
            case "foreground":
                this.foreground.draw(gameObject);
                break;
        }
    }

    /**
     * draws a childObject, object, in the foreground layer, and recursively draws all children
     * of the child object, and its children
     * @param {GameObject} gameObject the gameObject to be rendered in the specifed layer  
     */
    drawChildren(gameObject:GameEntity){
        this.drawCount += 1;
        
        if (this.drawable(gameObject))this.draw("foreground", gameObject); 

        for (let child of gameObject.getChildren()){
            this.drawChildren(child);
        }
    }


    drawLayer(objects:GameEntity[], layer:string){
        for (let object of objects){
            if (this.drawable(object)) this.draw(layer, object);

            for (let child of object.getChildren()){
                this.drawChildren(child);
            }
        }

    }





    ////////////////////////////////////////////////////////////////
    //
    // OTHER:
    //
    ////////////////////////////////////////////////////////////////

    /**
     * is called when the window is reized, and acts to resize the size of every canvas 
     * to reamin consistent with the window size
     */
    adjustCanvas() {
        this.background.resize();
        this.mainground.resize();
        this.foreground.resize();

        
    }


    /**
     * clears a given canvas layer 
     * @param {string} layer a render layer
     */
    clear(layer:string) {
        switch (layer) {
            case "background":
                this.background.clear()
                break;
            case "mainground":
                this.mainground.clear();
                break;
            case "foreground":
                this.foreground.clear();
                break;
        }
    }



    /**
     * clears all render images on every canvasLayer
     */
    clearAll() {
        this.background.clear();
        this.mainground.clear();
        this.foreground.clear();


    }


    /**
     * empties all currentlty observed gameObjects stored in the layerObjects[] of every CanvasLayer
     */
    reset(){
        this.background.reset();
        this.mainground.reset();
        this.foreground.reset();
    }



    /////////////////////////////////////////////////////////////
    //
    // ERROR/PERFORMANCE DETECTION
    // 
    /////////////////////////////////////////////////////////////




    checkPerformance(){
        if (this.performanceCheck){
            console.log("GRAPHICS-SYSTEM PERFORMANCE: ");
            console.log("->Number of Draws Per Frame: " + this.drawCount);

            this.performanceCheck = false;
            setTimeout(() => {
                this.performanceCheck = true;
            }, 5000);
        }
    }




    

    


} export default GraphicsSystem
