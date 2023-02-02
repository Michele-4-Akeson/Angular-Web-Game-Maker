import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HippoGame } from 'src/GameEngine/Interfaces/HippoGame';
import { EntityService } from './entity.service';
import { LevelService } from './level.service';
import {nanoid} from 'nanoid'


const backendURL = "http://localhost:5000/" || "https://hippo-engine-backend.onrender.com/" || "http://localhost:5000/"
const HIPPO_TOKEN:string = "HIPPO_TOKEN"
const HIPPO_USERNAME:string = "HIPPO_USERNAME"
const HIPPO_PASSWORD:string = "HIPPO_PASSWORD"
const profilePath = "profile"
const gamePath = "game"
const dateObj = new Date()



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  username:string = localStorage.getItem(HIPPO_USERNAME) || ""
  password:string = localStorage.getItem(HIPPO_PASSWORD) || ""
  token:string = localStorage.getItem(HIPPO_TOKEN) || ""
  games:HippoGame[] = []
  selectedGame:HippoGame|null = null


  constructor(private router:Router, private levelService:LevelService, private entityService:EntityService) {

    //sends the user to the login page on reload
    window.addEventListener('load', ()=>{
      router.navigate([""])
    });
  }









  /////////////////////////////
  // HTTP REQUESTS:
  /////////////////////////////



  /*
  PROFILE
  */
  
  /**
   * performs an http request, where if an account exsists, all data of that account 
   * (username, password, and token) is retrieved via a GET request, and stored for use. 
   * @param username the username of the acount
   * @param password the password of the account
   * @returns return a promise of true if the account exsists and 
   * the user will be logged in, otherwise false
   */
  async login(username:string, password:string):Promise<boolean>{
    try {
      const response = await fetch(backendURL + profilePath + "/token" + "?username=" + username + "&" + "password=" + password, {
        method:"GET",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
      });

      const data = await response.json()
      if (data != null){
        this.setStorage(username, password, data.token)
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

  


  ////////////////////////
  // GAME
  ////////////////////////


  /**
   * performs a POST request to the backend, and creates 
   * a new game with a unique id - if a new game is successfully 
   * created, it is pushed to the current gameData[] 
   * @param name the name of the game to be created
   */
  async createGame(name:string){
    const game = this.emptyGameData(name)
      
    try{
      const response = await fetch(backendURL + "game", {
        method:"POST",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({name:game.name, by:game.by, token:this.token, date:game.date, id:game.id, shared:game.shared, levelData:game.gameData})
      });

      const data = await response.json()
      console.log(data)
      if (data.success){
        this.games.push(game)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      return false
      
    }



  }



  /**
   * saveGame() breaks up the data of a HippoGame into smaller portions and sends them over
   * a HTTP PUT request as not to exceed payload issues (which were faced in inital build of applciation)
   * @returns true if save of game on backend was successfuly and false otherwise
   */
  async saveGame(): Promise<boolean>{
    const dataForGame : HippoGame = this.getDataFromLevelEditor()
    const gameID = {token:dataForGame.token, id:dataForGame.id, name:dataForGame.name}
    const gameAttributes = {scale:dataForGame.gameData.levelData.scale, columns:dataForGame.gameData.levelData.columns, rows:dataForGame.gameData.levelData.rows}
    const gameAssets = {assets:dataForGame.gameData.assets, savedEntities:dataForGame.gameData.savedEntities}
    const background = dataForGame.gameData.levelData.background
    const mainground = dataForGame.gameData.levelData.mainground


    const response1 = await this.saveAttributes(gameID, gameAttributes)
    const response2 = await this.saveAssets(gameID, gameAssets)
    const response3 = await this.saveLayer(gameID, background, "background")
    const response4 = await this.saveLayer(gameID, mainground, "mainground")
    if (response1 && response2 && response3 && response4){
      return true
    } 



    return false


  }

  
  async saveAttributes(gameID:Object, gameAttributes:Object):Promise<boolean>{
     // sends data for gameAttributes
     try{
      const response = await fetch(backendURL + gamePath + "/attributes", {
        method:"PUT",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({gameID, gameAttributes})
      });

      const data = await response.json()
      
      if (data.success){
        return true
      } else {
        return false
      }

      
    } catch (error) {
      console.log(error);
      return false
    }

  }


  
  async saveAssets(gameID:Object, gameAssets:Object):Promise<boolean>{
    // sends data for gameAssets
    try{
     const response = await fetch(backendURL + gamePath + "/assets", {
       method:"PUT",
       headers: {
         "Content-Type":"application/json",
         "Accept":"application/json"
       },
       body: JSON.stringify({gameID, gameAssets})
     });

     const data = await response.json()
     
     if (data.success){
       return true
     } else {
       return false
     }

     
   } catch (error) {
     console.log(error);
     return false
   }

 }


 /**
  * saves the array of strings repersenting gameObjects in a layer to a background
  * @param gameID 
  * @param gameLayer 
  * @param target 
  * @returns 
  */
 async saveLayer(gameID:Object, gameLayer:any, target:string):Promise<boolean>{
  // sends data for layer
  try{
   const response = await fetch(backendURL + gamePath + "/layer", {
     method:"PUT",
     headers: {
       "Content-Type":"application/json",
       "Accept":"application/json"
     },
     body: JSON.stringify({gameID, layer:gameLayer, target:target})
   });

   const data = await response.json()
   
   if (data.success){
     return true
   } else {
     return false
   }

   
 } catch (error) {
   console.log(error);
   return false
 }

}







  
  async deleteGame(name:string, id:string): Promise<boolean>{
    this.games = this.games.filter((game)=>{return game.name != name || game.id != id})

     try{
       const response = await fetch(backendURL + gamePath, {
         method:"DELETE",
         headers: {
           "Content-Type":"application/json",
           "Accept":"application/json"
         },
         body: JSON.stringify({token:this.token, name:name, id:id})
       });
 
       const data = await response.json()
       
       if (data.success){
         return true
       } else {
         return false
       }
     } catch (error) {
       console.log(error);
       return false
     }
 
   }


   /**
    * performs an HTTP PUT request to switch the shared attribute of game
    * in the database, whereby, if a game has shared:true, it will be visible 
    * by all users in the shared game page
    * @param name the name of the game
    * @param id the id of the game
    * @returns a promise of true if the game's shared attribute is successfully switched
    */
   async toggleSharing(name:string, id:string):Promise<boolean>{
    let isShared

    // finds the game, and sets isShared to be the negation of that 
    for (let game of this.games){
      if (game.name == name && game.id == id){
        isShared = !game.shared
        game.shared = isShared
        break
      }
    }

    try{
      const response = await fetch(backendURL + gamePath + "/shared", {
        method:"PUT",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({name:name, id:id, token:this.token, shared:isShared, username:this.username})
      });

      const data = await response.json()
      
      if (data.success){
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error);
      return false
    }
  }

  

  /**
   * performs an http request where all games owned by a user are retrieved from
   * the Games collection of the database, storing that data in the field, gameData.
   * The games owned by the user are determiend by the user's token
   * @returns return a promise of true if the retrieval was sucessful
   */
  async getUserGames():Promise<boolean>{
    try {
      const response = await fetch(backendURL + gamePath + "?token=" + this.token + "&username=" + this.username, {
        method:"GET",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
      });

      const data = await response.json()
      if (data != null){
        this.games = data
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
   * performs an HTTP GET request to retrieve all shared games
   * @returns true if shared games are retrieved from backend
   */
  async getSharedGames(){
    try {
      const response = await fetch(backendURL + gamePath + "/shared", {
        method:"GET",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
      });

      const data = await response.json()
      console.log(data)
      if (data != null){
        this.games = data
        return true
      } else {
        return false
      }
  
  
    } catch (error){
      console.log(error);
      return false
    }
  }



  ////////////////////////////////
  // NAVIGATION
  ////////////////////////////////

  /**
   * routes the player to the editor page with the game loaded into the editor
   * @param name name of the game to be opened
   * @param id id of the game
   * @returns true if the game was succesfully opened, otherwise false is returned
   */
  openEditor(name:string, id:string){
    for (let game of this.games){
      if (game.name == name && game.id == id){
        this.selectedGame = game
        this.levelService.loadGame(game)
        this.entityService.savedEntities = game.gameData.savedEntities
        this.entityService.assetList = game.gameData.assets
        
        this.router.navigate(["hippo-game-builder"])
        return true
      }
    }

    return false
  }


  openGame(name:string, id:string){
    for (let game of this.games){
      if (game.name == name && game.id == id){
        this.selectedGame = game
        this.entityService.assetList = game.gameData.assets
        this.levelService.loadGame(game)
        this.router.navigate(["hippo-game"])
      }
    }

  }


  ///////////////////////////////
  // HELPER FUNCTIONS
  ///////////////////////////////


  isLoggedIn(){
    return this.token != "" && this.username != "" && this.password != ""
  }

  /**
   * @returns a string reperesnting the current date and time
   */
  displayDate(){
    return dateObj.toLocaleDateString("en-us", { weekday:"long", year:"numeric", month:"short", day:"numeric"})
  }


  /**
   * sets the username, password, and token in local storage for 
   * use later
   * @param username 
   * @param password 
   * @param token 
   */
  setStorage(username:string, password:string, token:string){
    this.username = username
    this.password = password
    this.token = token
    localStorage.setItem(HIPPO_USERNAME, username)
    localStorage.setItem(HIPPO_PASSWORD, password)
    localStorage.setItem(HIPPO_TOKEN, token)
  }


  /**
   * 
   * @returns an object repersenting the game currently in 
   * the level editor
   */
  getDataFromLevelEditor(){
    const dataForGame:HippoGame = {
      name: this.levelService.name, by: this.username, date: this.displayDate(),
      id: this.levelService.id,
      token: this.token,
      shared: this.levelService.shared,
      gameData: {assets: this.entityService.assetList, savedEntities: this.entityService.savedEntities, levelData: this.levelService.getLevelData()}
    }

    return dataForGame

  }

  /**
   * returns an object that will be stored in the database as an "empty" version of a game
   * that can be retrieved, loaded into the editor, and updated by the user
   * @param name the name of the game to be created
   * @returns a GameData Object with the date the game was created, as well as an empty LevelData Object
   */
  emptyGameData(name:string):HippoGame{
    this.levelService.makeLevel()
    return {name: name, 
            date: this.displayDate(), 
            by: this.username, 
            shared:false,
            token:this.token,
            id:nanoid(),
            gameData: {assets: [], savedEntities: this.entityService.savedEntities, levelData: this.levelService.getLevelData()}
          }

  }






}
