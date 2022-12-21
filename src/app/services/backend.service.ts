import { Injectable } from '@angular/core';

const backendURL:string = ""
const HIPPO_KEY:string = "HIPPO_TOKEN"

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  constructor() { }

  async login(username:string, password:string){
    try {
      const response = await fetch(backendURL + "/token" + "?username=" + username + "&" + "password=" + password, {
        method:"GET",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
      });
  
      return response.json()
  
    } catch (error){
      console.log(error);
    }
  }


  /**
   * 
   * @returns true if the user has a token in local storage indicating that they are logged in
   */
  isLoggedIn():boolean{
    return localStorage.getItem(HIPPO_KEY) != null
  }
}
