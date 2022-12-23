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

import { AppRoutingModule } from './routing/app-routing.module';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { PrivateGamesPageComponent } from './components/pages/private-games-page/private-games-page.component';
import { PublicGamesComponent } from './components/pages/public-games/public-games.component';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';
import { BuildPageComponent } from './components/pages/build-page/build-page.component';

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
    HomePageComponent,
    PrivateGamesPageComponent,
    PublicGamesComponent,
    PlayPageComponent,
    BuildPageComponent,
    
  ],
  imports: [
    BrowserModule, FormsModule, FontAwesomeModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
