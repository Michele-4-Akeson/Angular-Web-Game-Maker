import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  signOut = faSignOutAlt
  isLoading:boolean = false
  constructor(private profile:ProfileService, private router:Router){}

  async goTo(route:string){
    let dataRetrieved = null
    this.isLoading = true
    switch(route){
      case "your-hippo-games":
        dataRetrieved = await this.profile.getUserGames()
        if (dataRetrieved){
          this.router.navigate([route])
        }
        break
      case "shared-hippo-games":
        dataRetrieved = await this.profile.getSharedGames()
        if (dataRetrieved){
          this.router.navigate([route])
        }
        break
      
      case "":
        this.router.navigate([""])
    }
  }

}
