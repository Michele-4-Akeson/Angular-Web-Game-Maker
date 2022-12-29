import BoxCollider from "./BoxCollider";

/**
 * The BoxTrigger component has the same functionality as the BoxCollider, however, it will not cause 
 * a gameObject that collides with it to stop moving - it will be used to update the functionality of a gameObejct 
 * based on the data of the BoxTrigger - extends {@link BoxCollider}  
 * @param {number} boxSize
 * @param {number} size
 * @param {boolean} dynamic
 * @property {number} centerX the x-coordinate of the center of the BoxTrigger
 * @property {number} centerY the Y-coordinate of the center of the BoxTrigger
 */
 class BoxTrigger extends BoxCollider{
    centerX : number
    centerY : number
    constructor(boxSize:number, size:number){
        super(size);
        this.centerX = boxSize / 2;
        this.centerY = boxSize / 2;

    }

} export default BoxTrigger