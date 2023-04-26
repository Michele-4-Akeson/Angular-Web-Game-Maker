import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  faCog = faCog
  faRocket = faRocket

}
