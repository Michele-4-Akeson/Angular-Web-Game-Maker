
/**
 * the Spritesheet class stores data of a spritesheet image
 * such as the number of columns and row of the spritesheet
 * (which are used to determine the frame size)
 * @param {HTMLImageElement} image the html image element used by the canvas to draw an image
 * @param {number} squareSize the crop size used to retrieve a portion of that image to be drawn
 * @property {number} squareSize the crop size used to retrieve a portion of that image to be drawn
 * @property {number} imageWidth the width of the image asset in pixels
 * @property {number} imageHeight the height of the image asset in pixels
 * @property {number} columns the number of columns the spritesheet has based on the squareSize and the width of the image
 * @property {number} rows the number of rows the spritesheet has based on the squareSize and the width of the image
 */

 class Spritesheet{
    sprite : HTMLImageElement
    squareSize : number
    imageWidth : number
    imageHeight : number
    columns : number
    rows : number
    constructor(image:HTMLImageElement, squareSize : number) {
        this.sprite = image;
        this.squareSize = squareSize;
        this.imageWidth = image.width;
        this.imageHeight = image.height;
        this.columns = this.imageWidth / squareSize;
        this.rows = this.imageHeight / squareSize;
        
    }
} export default Spritesheet