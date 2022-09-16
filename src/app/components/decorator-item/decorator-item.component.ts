import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from 'src/app/services/entity.service';
import { Decorator } from 'src/GameEngine/Interfaces/Decorator';
import { faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-decorator-item',
  templateUrl: './decorator-item.component.html',
  styleUrls: ['./decorator-item.component.css']
})
export class DecoratorItemComponent implements OnInit {
  @Input() decorator!:Decorator
  trashIcon = faTrash
  constructor(public entity:EntityService) { }

  ngOnInit(): void {
  }

  sendValue(name:string, typeName:string, e:any){
    console.log(name, typeName, e)
    console.log(e)
    this.entity.setInput(this.decorator.name, this.decorator.index!, typeName, name, e)

  }

  getEventValue(name:string, typeName:string, e:any){
    this.entity.setInput(this.decorator.name, this.decorator.index!, typeName, name, e.target.value)
  }

  remove(){
    this.entity.removeDecorator(this.decorator.name)
  }

}
