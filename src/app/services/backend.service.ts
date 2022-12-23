import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {nanoid} from 'nanoid'
import { GameData } from 'src/GameEngine/Interfaces/GameData';
import { LevelData } from 'src/GameEngine/Interfaces/LevelData';
import { EntityService } from './entity.service';
import { LevelService } from './level.service';






const backendURL = "http://localhost:5000/"
const HIPPO_KEY:string = "HIPPO_TOKEN"
const HIPPO_NAME:string = "hippo-username"
const HIPPO_PASSWORD:string = "hippo-password"

const dateObj = new Date()


  
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  username:string = localStorage.getItem(HIPPO_NAME) || ""
  password:string = localStorage.getItem(HIPPO_PASSWORD) || ""
  token:string = localStorage.getItem(HIPPO_KEY) || ""
  games:GameData[] = []
  constructor(private router:Router, private levelService:LevelService, private entityService:EntityService) {
    window.addEventListener('load', ()=>{
      this.navigateTo("")
    });
  }


  /**
   * performs an http request, where if an account exsists, all data of that account is retrieved
   * via a GET request, and stored for use. 
   * @param username the username of the acount
   * @param password the password of the account
   * @returns return a promise of true if the account exsists and 
   * the user will be logged in, otherwise false
   */
  async login(username:string, password:string):Promise<boolean>{
    try {
      const response = await fetch(backendURL + "profile" + "/token" + "?username=" + username + "&" + "password=" + password, {
        method:"GET",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
      });

      const data = await response.json()
      if (data != null){
        username = username
        password = password
        
        this.token = data.token
        this.games = data.games 

        localStorage.setItem(HIPPO_KEY, data.token)
        localStorage.setItem(HIPPO_NAME, username)
        localStorage.setItem(HIPPO_PASSWORD, password)
        this.router.navigate(["hippo-home"])
        return true
      } else {
        return false
      }
  
  
    } catch (error){
      console.log(error);
      return false
    }

  }


  /**
   * the fetch request returns {success:boolean} to indicate whether 
   * an account was created or if an account already exsist with the 
   * same username 
   * @param username the username of the account to be registered
   * @param password the password of the account to be registered
   * @returns a Promise of true if the account created and navigates to the home page, 
   * otherwise returning false -- must use await to get actual value
   */
  async register(username:string, password:string):Promise<boolean>{
    try{
      const response = await fetch(backendURL + "profile", {
        method:"POST",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({username:username, password:password, token:nanoid()})
      });
  
      const data = await response.json()
      if (data.success){
        this.login(username, password)
        return true
      } else {
        return false
      }
  
    } catch (error) {
      console.log(error);
      return false
  
    }

  }



  async createNewGame(name:string){
    const gameData = this.emptyGameData(name)
      
    try{
      const response = await fetch(backendURL + "profile" + "/game", {
        method:"POST",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({token:this.token, gameData:gameData})
      });
  
      const data = await response.json()
      
      if (data.success){
        this.games.push(gameData)
      }
    } catch (error) {
      console.log(error);
      
    }



  }



  async saveGame(){
    const gameData:GameData = {
      name: this.levelService.name, by: this.username, date: this.displayDate(),
      assets: [],
      savedEntities: this.entityService.savedEntities,
      levelData: this.levelService.getLevelData()
    }

    try{
      const response = await fetch(backendURL + "profile" + "/game", {
        method:"PUT",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({token:this.token, gameData:gameData})
      });
  
      const data = await response.json()
      
      if (data.success){
        this.games.push(gameData)
      }
    } catch (error) {
      console.log(error);
      
    }

  }





















  logout(){
    localStorage.removeItem(HIPPO_KEY)
    this.router.navigate([""])
  }


  /**
   * 
   * @returns true if the user has a token in local storage indicating that they are logged in
   */
  isLoggedIn():boolean{
    console.log(localStorage.getItem(HIPPO_KEY) != null)
    return localStorage.getItem(HIPPO_KEY) != null
  }



  navigateTo(route:string){
    this.router.navigate([route])
  }



  /**
   * 
   */

  displayDate(){
    return dateObj.toLocaleString("en-US")
  }


  /**
   * returns an object that will be stored in the database as an "empty" version of a game
   * that can be retrieved, loaded into the editor, and updated by the user
   * @param name the name of the game to be created
   * @returns a GameData Object with the date the game was created, as well as an empty LevelData Object
   */
  emptyGameData(name:string):GameData{
    this.levelService.makeLevel()
    return {name: name, 
            date: this.displayDate(), 
            by: this.username, 
            assets: [], 
            savedEntities:[],
            levelData:this.levelService.getLevelData()}
  }


  /**
   * the game and it's data is passed to the levelService such that all
   * all gameData can be parsed by the GameManager when the page opens
   * allowing for users to view a game they were working on
   * 
   * 
   * parses through the list of gameData by name and passes the game
   * with the matching name
   * @param name the name of the game to be loaded into the editor 
   */
  loadGame(name:string){
    for (let game of this.games){
      if (game.name == name){
        this.levelService.loadGameData(game)
        this.entityService.savedEntities = game.savedEntities
        this.navigateTo("hippo-game-builder")
      }
    }
  }



}
