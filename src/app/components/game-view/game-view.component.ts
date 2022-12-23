import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { LevelService } from 'src/app/services/level.service';
import GameManager from 'src/GameEngine/GameSystems/GameManager';
import { faEraser, faClose, faUpload, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faChartArea, faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { BackendService } from 'src/app/services/backend.service';


@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})


export class GameViewComponent implements AfterViewInit {
  @ViewChild('gameview') gameView! : ElementRef
  gameManager:GameManager | undefined
  isPlaying:boolean = false
  showError:boolean = false
  private isMouseDown = false
  private isShiftDown = false
  private id:any
  columns:number = 48
  rows:number = 32
  scale : number = 32
  errorMessage:string = ""
  layer:string = "mainground"
  eraserIcon = faEraser
  magPlusIcon = faMagnifyingGlassPlus
  magMinusIcon = faMagnifyingGlassMinus
  chart=faChartArea
  playIcon=faPlayCircle
  pauseIcon = faPauseCircle
  closeIcon = faClose
  export = faUpload
  constructor(private entityService:EntityService, private levelService:LevelService, private backendService:BackendService) { }

  

  
  ngAfterViewInit(): void {
    //console.log(this.gameView.nativeElement.children)
    this.gameManager = new GameManager(this.gameView.nativeElement.children)
    document.addEventListener("resize", (e:any)=>{
      this.gameManager?.resize()
    })

    document.addEventListener("keydown", (e:KeyboardEvent)=>{
      if (e.key == "Shift") this.isShiftDown = true
    })

    document.addEventListener("keyup", (e:KeyboardEvent)=>{
      if (e.key == "Shift") this.isShiftDown = false
    })

    this.gameView.nativeElement.addEventListener("mousedown", (e:any)=>{
      this.isMouseDown = true

      if (this.isShiftDown){
        this.removeEntity(e)
      } else {
        this.addEntity(e)
        //this.levelService.printLayers()
      }
   
      
    })

    this.gameView.nativeElement.addEventListener("mouseup", (e:any)=>{
      this.isMouseDown = false
    })

    this.gameView.nativeElement.addEventListener("mousemove", (e:any)=>{
      if (this.isMouseDown && !this.showError){
        if (this.isShiftDown){
          this.removeEntity(e)
        } else {
          this.addEntity(e)
          //this.levelService.printLayers()
        }
      }
      
    })


    this.preview()

  }

  changeSize(){
    this.levelService.resizeLevel(this.columns, this.rows)
    this.preview()
  }

  increaseZoom(){
    this.scale += 4
    this.levelService.setScale(this.scale)
    this.preview()
  }

  decreaseZoom(){
    this.scale -= 4
    this.levelService.setScale(this.scale)
    this.preview()
  }
  



  addEntity(e:any){
    const position = this.getCanvasCoordinates(e)
    if (this.entityService.getAnimation().spritesheet == null){
      this.errorMessage = "Error: Sprite Not Selected "
      this.showError = true
    } else {
      try{
        this.levelService.addEntity(position, this.entityService.createEntity())
        this.preview()
      } catch(e:any){
        console.log(e)
        this.errorMessage = e.message

        if (e.message == "Maximum call stack size exceeded"){
          this.errorMessage += " => The entity '" + this.entityService.getName() + "' created an infinite recursion as it's attached to an object that's attached to it "
        }
        this.levelService.makeLevel()
        this.preview()

        this.showError = true
        
      }
     
    }
   
    
  }

  removeError(){
    this.errorMessage = ""
    this.showError = false
    this.isMouseDown = false
  }


  removeEntity(e:any){
    const position = this.getCanvasCoordinates(e)
    this.levelService.removeEntity(position)
    this.preview()

  }

  getCanvasCoordinates(e:any){
    const scale = this.levelService.getScale()
    const { x, y } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;

    //console.log([Math.floor(mouseX / scale), Math.floor(mouseY / scale)])
    return [Math.floor(mouseX / scale), Math.floor(mouseY / scale)]
 }


 preview(){
  this.gameManager?.loadLevel(this.levelService.getLevelData())
  this.gameManager?.update()
}

clearScene(){
  this.levelService.makeLevel()
  this.preview()
}


play(){
  if (this.isPlaying) {
    cancelAnimationFrame(this.id)
    this.isPlaying = false
    this.preview()
  }
  else {
    this.isPlaying = true
    this.gameLoop()
  }
  
}

gameLoop(){
  this.gameManager?.update()
  this.id = requestAnimationFrame(this.gameLoop.bind(this))
  console.log("x")
}


switchLayer(){
  if (this.layer == "background") {
    this.layer = "mainground"
    this.showError = false
  } else {
    this.layer = "background"
    this.errorMessage = "Note: Game Entities in background layer do not perform movement abilities"
    this.showError = true
  }

  this.levelService.setLayer(this.layer)
}


exportJson(){
  this.levelService.exportToJsonFile()
}


/**
 * calls the service perform a post request to the backend, adding the games data
 */
saveGame(){
  this.backendService.saveGame()
}

}
