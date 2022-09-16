import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { Entity } from 'src/GameEngine/Interfaces/Entity';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-asset-box',
  templateUrl: './asset-box.component.html',
  styleUrls: ['./asset-box.component.css']
})
export class AssetBoxComponent implements OnInit {
  @Input() asset! : Entity
  trashIcon = faTrash
  constructor(private entity:EntityService) { }

  ngOnInit(): void {
  }


  selectEntity(){
    console.log(this.entity)
    this.entity.selectEntity(this.asset.name)
  }


  delete(){
    this.entity.deleteEntity(this.asset.name)
  }


}
