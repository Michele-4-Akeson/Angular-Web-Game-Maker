import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuard } from '../guard/auth.guard';
import { EditorPageComponent } from '../pages/editor-page/editor-page.component';
import { GamePageComponent } from '../pages/game-page/game-page.component';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { SharedGamesPageComponent } from '../pages/shared-games-page/shared-games-page.component';
import { YourGamesPageComponent } from '../pages/your-games-page/your-games-page.component';

 
const routes: Routes = [ 
  {path:"", component:LoginPageComponent},
  {path:"hippo-home", component:HomePageComponent, canActivate:[AuthGuard]},
  {path:"your-hippo-games", component:YourGamesPageComponent, canActivate:[AuthGuard]},
  {path:"shared-hippo-games", component:SharedGamesPageComponent, canActivate:[AuthGuard]},
  {path:"hippo-game-builder", component:EditorPageComponent, canActivate:[AuthGuard]},
  {path:"hippo-game", component:GamePageComponent, canActivate:[AuthGuard]},
  {path:"**", redirectTo:""}


]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
