import { AfterViewInit, Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-shared-games-page',
  templateUrl: './shared-games-page.component.html',
  styleUrls: ['./shared-games-page.component.css']
})
export class SharedGamesPageComponent implements AfterViewInit {

  constructor(public profile:ProfileService){}

  ngAfterViewInit(): void {
    this.profile.getSharedGames()
  }

  openGame(name:string, id:string){
    this.profile.openGame(name, id)

  }


}
