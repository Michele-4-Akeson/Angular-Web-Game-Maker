import Input from "src/GameEngine/GameComponents/Input";
import GameEntity from "src/GameEngine/Interfaces/GameEntity";
import { Subject } from "src/GameEngine/Interfaces/Subject";
import EntityDecorator from "./EnityDecorator";

class InputUser extends EntityDecorator{
    input:Input 
    constructor(gameEntity:GameEntity, subject:Subject){
        super(gameEntity)
        this.input = new Input(subject)
    }
} export default InputUser