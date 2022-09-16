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
  ],
  imports: [
    BrowserModule, FormsModule, FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
