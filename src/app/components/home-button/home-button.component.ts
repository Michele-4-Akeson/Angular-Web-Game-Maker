import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.css']
})
export class HomeButtonComponent {
  homeIcon = faHome
  constructor(private router:Router){}

  async goTo(route:string){
    this.router.navigate([route])
    
  }

}
