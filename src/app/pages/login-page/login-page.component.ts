import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

const loginAccount = "Login To Your Account:"
const createAccount = "Create A New Account:"


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username:string = this.profile.username
  password:string = this.profile.password
  loggingIn:boolean = true
  message:string = loginAccount
  pageText:string = "Login"
  constructor(private profile:ProfileService, private router:Router) { }

  ngOnInit(): void {
    console.log(this.profile.isLoggedIn())
    if (this.profile.isLoggedIn()){
      this.router.navigate(["home"])
    }
  }

  signIn(){
    if (this.loggingIn) this.login()
    else this.register()
  }

  /**
   * attempts to login into an account with
   * the provided username and password
   */
  async login(){
    //get request to see if account exsists
    console.log(this.username, this.password)
    if (this.username != "" && this.password != ""){
      let response = await this.profile.login(this.username, this.password)
      this.message = "loading..."
      if (!response){
        alert("unable to login to account")
        this.message = loginAccount


      }
      
    } else {
      alert("unable to register new account: 'missing username or password'")

    }


  }
   

  async register(){
    if (this.username != "" && this.password != ""){
      let response = await this.profile.register(this.username, this.password) 
      this.message = "loading..."

      if (!response){
        alert("unable to register new account: 'username already in use'")
        
        
      }
    } else {
      alert("unable to register new account: 'missing username or password'")

    }

    this.message = createAccount

  }


  setLoggingIn(state:boolean){
    this.loggingIn = state
    if (this.loggingIn){
      this.pageText = "Login"
      this.message = "Login To Your Account"
    } else {
      this.pageText = "Register"
      this.message = "Create A New Account"

    }

  }

  



}

