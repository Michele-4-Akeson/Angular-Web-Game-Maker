import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuildPageComponent } from '../components/pages/build-page/build-page.component';
import { HomePageComponent } from '../components/pages/home-page/home-page.component';

import { LoginPageComponent } from '../components/pages/login-page/login-page.component';
import { PlayPageComponent } from '../components/pages/play-page/play-page.component';
import { PrivateGamesPageComponent } from '../components/pages/private-games-page/private-games-page.component';
import { PublicGamesComponent } from '../components/pages/public-games/public-games.component';
import { AuthGuard } from '../guard/auth.guard';

 
const routes: Routes = [ 
  {path:"", component:LoginPageComponent},
  {path:"hippo-home", component:HomePageComponent, canActivate:[AuthGuard]},
  {path:"your-hippo-games", component:PrivateGamesPageComponent, canActivate:[AuthGuard]},
  {path:"shared-hippo-games", component:PublicGamesComponent, canActivate:[AuthGuard]},
  {path:"hippo-game-builder", component:BuildPageComponent, canActivate:[AuthGuard]},
  {path:"hippo-player", component:PlayPageComponent, canActivate:[AuthGuard]},
  {path:"**", redirectTo:""}


]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
