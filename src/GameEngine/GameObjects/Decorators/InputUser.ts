import Input from "src/GameEngine/GameComponents/Input";
import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import EntityDecorator from "./EnityDecorator";

class InputUser extends EntityDecorator{
    input:Input 
    /**
     * Class extended from for decorators that rely on some form of input from the user
     * @param gameEntity 
     * @param subject 
     */
    constructor(gameEntity:GameEntity, subject:Subject){
        super(gameEntity)
        this.input = new Input(subject)
    }
} export default InputUser