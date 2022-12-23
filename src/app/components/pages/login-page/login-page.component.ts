import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';

const HIPPO_NAME:string = "hippo-username"
const HIPPO_PASSWORD:string = "hippo-password"
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username:string = localStorage.getItem(HIPPO_NAME) || ""
  password:string = localStorage.getItem(HIPPO_PASSWORD) || ""
  loggingIn:boolean = true
  errorMessage:string = ""
  pageText:string = "Register"
  constructor(private backendService:BackendService, private router:Router) { }

  ngOnInit(): void {
    console.log(this.backendService.isLoggedIn())
    if (this.backendService.isLoggedIn()){
      console.log("nav")
      this.router.navigate(["home"])
    }
  }

  /**
   * 
   */
  async login(){
    //get request to see if account exsists
    console.log(this.username, this.password)
    if (this.username != "" && this.password != ""){
      let response = await this.backendService.login(this.username, this.password)
      //route to home
      console.log(response)
      if (!response){
        this.errorMessage = "Unable to login"
      }
      
    } else {
      this.errorMessage = "Username and/or Password missing"
    }
  }
   

  async register(){
    if (this.username != "" && this.password != ""){
      let response = await this.backendService.register(this.username, this.password) 
      if (!response){
        this.errorMessage = "Username Already Exsists"
      }
    } else {
      this.errorMessage = "Username and/or Password missing"
    }
  }


  toggle(){
    if (this.loggingIn){
      this.pageText = "Login"
    } else {
      this.pageText = "Register"
    }

    this.loggingIn = !this.loggingIn
  }



}
