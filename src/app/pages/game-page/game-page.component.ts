import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LevelService } from 'src/app/services/level.service';
import GameManager from 'src/GameEngine/GameSystems/GameManager';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})

export class GamePageComponent implements AfterViewInit {
  @ViewChild('gameview') gameView! : ElementRef
  gameManager:GameManager | undefined
  isPlaying:boolean = false
  id: any;


  constructor(private levelService:LevelService){}

  ngAfterViewInit(): void {
    this.gameManager = new GameManager(this.gameView.nativeElement.children)
    document.addEventListener("resize", (e:any)=>{
      this.gameManager?.resize()
    })
    setTimeout(()=>{
      this.preview()

      setTimeout(()=>{
        this.play()
      }, 200)

    }, 150)
    
  }

preview(){
  this.gameManager?.loadLevel(this.levelService.getLevelData())
  this.gameManager?.update()
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
}




}
