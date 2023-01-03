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

import { YourGamesPageComponent } from './pages/your-games-page/your-games-page.component';
import { SharedGamesPageComponent } from './pages/shared-games-page/shared-games-page.component';
import { EditorPageComponent } from './pages/editor-page/editor-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RobotSVGComponent } from './components/robot-svg/robot-svg.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeButtonComponent } from './components/home-button/home-button.component';

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
    YourGamesPageComponent,
    SharedGamesPageComponent,
    EditorPageComponent,
    GamePageComponent,
    RobotSVGComponent,
    HomePageComponent,
    HomeButtonComponent,
    
  ],
  imports: [
    BrowserModule, FormsModule, FontAwesomeModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
