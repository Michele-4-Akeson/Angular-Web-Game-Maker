import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { SpriteSelectorComponent } from './components/sprite-selector/sprite-selector.component';
import { FormsModule } from '@angular/forms';
import { InspectorComponent } from './components/inspector/inspector.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { IncrementorComponent } from './components/incrementor/incrementor.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { DecoratorItemComponent } from './components/decorator-item/decorator-item.component';
import { AssetBoxComponent } from './components/asset-box/asset-box.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControllerSvgComponent } from './components/controller-svg/controller-svg.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';

import { Routes, RouterModule } from '@angular/router';
import { GameBuilderComponent } from './components/pages/game-builder/game-builder.component';
import { HomeComponent } from './components/pages/home/home.component';
import { BuildPageComponent } from './components/pages/build-page/build-page.component';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';
import { PublicGamesComponent } from './components/pages/public-games/public-games.component';
import { AuthGuard } from './guard/auth.guard';



@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    SpriteSelectorComponent,
    InspectorComponent,
    CheckboxComponent,
    SelectBoxComponent,
    IncrementorComponent,
    SearchBoxComponent,
    DecoratorItemComponent,
    AssetBoxComponent,
    ControllerSvgComponent,
    LoginPageComponent,
    GameBuilderComponent,
  ],
  imports: [
    BrowserModule, FormsModule, FontAwesomeModule, 
    RouterModule.forRoot([{path:"", component:LoginPageComponent},
    {path:"home", component:HomeComponent, children:[
      {path:"your-games", component:BuildPageComponent, children:[{path:"builder", component:GameBuilderComponent}]},
      {path:"public-games", component:PublicGamesComponent, children:[{path:"play", component:PlayPageComponent}]}
    ], canActivate:[AuthGuard]}])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
