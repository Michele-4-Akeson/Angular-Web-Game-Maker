import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private backendService:BackendService, private router:Router) { }

  ngOnInit(): void {
  }

  /**
   * 
   */
  async login(){
    
    this.router.navigate(["home"])

    //get request to see if account exsists
    let reponse:boolean = await this.backendService.login("username", "password")
    //route to home
    
  }

}
