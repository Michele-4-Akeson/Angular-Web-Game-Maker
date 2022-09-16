class KeyPressListener{
    key:string
    keyEnabled:boolean = false
    bound:boolean = false

    callFunction:Function
    constructor(key:string, callFuntion:Function){
        this.key = key
        this.callFunction = ()=>{callFuntion()}

      

    }


    keyDownFunction(event:KeyboardEvent){
        console.log(event.key)
        if (event.key == this.key){
            if (this.keyEnabled){
                this.keyEnabled = false
                this.callFunction()
            }
        }
    }

    keyUpFunction(event:KeyboardEvent){
        if (event.key == this.key){
            this.keyEnabled = true
        }
    }


    
    bind() {
        /*
        bind() adds the event such that when the key is pressed, the function associated is executed
        */
        document.addEventListener("keydown", (e:KeyboardEvent)=>{
            this.keyDownFunction(e)
        })

        document.addEventListener("keyup", (e:KeyboardEvent) => {
            this.keyUpFunction(e)
        })
    }



} export default KeyPressListener