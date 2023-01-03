import { Component } from '@angular/core';
import { LevelService } from 'src/app/services/level.service';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent {
  constructor(public levelService:LevelService){}

}
