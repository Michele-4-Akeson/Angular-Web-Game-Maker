import { AfterViewInit, Component } from '@angular/core';
import { faTrash, faHippo, faGamepad, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-your-games-page',
  templateUrl: './your-games-page.component.html',
  styleUrls: ['./your-games-page.component.css']
})


export class YourGamesPageComponent implements AfterViewInit {
  gameName:string = ""
  creatingGame:boolean = false
  trashIcon = faTrash
  shareIcon = faHippo
  createIcon = faPlus

  constructor(public profile:ProfileService){}
  ngAfterViewInit(): void {
    this.profile.getUserGames()
  }


  async createGame(){
    if (this.gameName != ""){
      let isGameCreated = await this.profile.createGame(this.gameName)
      
      this.creatingGame = false
      this.gameName = ""
    }
  }

  async delete(name:string, id:string){
    this.profile.deleteGame(name, id)
  }

  
  openEditor(name:string, id:string){
    const foundGame = this.profile.openEditor(name, id)

    if (!foundGame){
      // add an error message and open empty editor
    }
  }


  toggleShare(name:string, id:string){
    this.profile.toggleSharing(name, id)
  }

}
