import { AfterViewInit, Component } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-private-games-page',
  templateUrl: './private-games-page.component.html',
  styleUrls: ['./private-games-page.component.css']
})
export class PrivateGamesPageComponent {
  gameName:string = ""
  showNewGame:boolean = false
  trashIcon = faTrash
  constructor(public backendService:BackendService){}




  createNewGame(){
    this.backendService.createNewGame(this.gameName)

  }


  /**
   * calls the backendService to load a given game, and navigate to the game builder
   * @param name the name of the game to be loaded into the editor
   */
  openEditor(name:string){
    this.backendService.loadGame(name)

  }

}
