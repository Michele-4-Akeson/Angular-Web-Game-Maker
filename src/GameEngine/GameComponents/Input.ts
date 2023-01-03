import { Subject } from "../Interfaces/Subject"
import { Subscriber } from "../Interfaces/Subscriber"
class Input implements Subscriber {
    heldKeys:string[] = []
    lastInput:string = ""
    //eventBindings:KeyPressListener[]  = []
    /**
     * A subscriber that watches values passed to the gameManagers eventListener.\
     * Note - Could Make this class Subject to that is watched by Entitiies and, those entities
     * are updated whenever a new input occurs rather than perfoming a check every update
     * @param subject 
     */
    constructor(subject:Subject) {
        this.subscribe(subject)
        /*
        document.addEventListener("keydown", (e:KeyboardEvent)=>{
            this.onKeyDown(e.key)

        })

        document.addEventListener("keyup", (e:KeyboardEvent)=>{
            this.onKeyUp(e.key)
        })
        */
    }

    isKeyDown(key:string):boolean{
        return (this.heldKeys.indexOf(key) != -1)
    }

    private onKeyDown(key:string){
        // adds key to list of keys which are held down
        console.log(key)
        this.lastInput = key
        if (!this.isKeyDown(key)) this.heldKeys.unshift(key) 
    }

    private onKeyUp(key:string){
        // removes key from the list of keys which are held down
        if (this.isKeyDown(key)){
            let index = this.heldKeys.indexOf(key)
            this.heldKeys.splice(index, 1)
        }
    }

    /**
     * 
     * @returns a string of left, right, up, or down, based on the 
     * last input provided by the user via the arrowkeys
     */



    subscribe(subject: Subject): void {
        subject.addSub(this)
    }

    subjectUpdate(type: string, key: string): void {
        if (type == "keydown") this.onKeyDown(key)
        else this.onKeyUp(key)
    }



    /*
        bindEvent(key:string, callFuntion:Function){
        let keyPressListener = new KeyPressListener(key, callFuntion)
        keyPressListener.bind()
        this.eventBindings.push(keyPressListener)
    }
    */


    
    
} export default Input