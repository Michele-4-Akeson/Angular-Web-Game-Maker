import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlus, faMinus, faArrowDown,faArrowUp } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-incrementor',
  templateUrl: './incrementor.component.html',
  styleUrls: ['./incrementor.component.css']
})
export class IncrementorComponent implements OnInit {
  @Input() label:string = ""
  @Input() value!:number
  @Input() negative:boolean = true
  @Output() onChange = new EventEmitter<number>()
  plusIcon = faPlus
  minusIcon = faMinus
  arrowDown = faArrowDown
  arrowUp = faArrowUp
  constructor() { }

  ngOnInit(): void {
  }

  setValue(){
    this.checkNeagtive()
    this.onChange.emit(this.value)
  }

  checkNeagtive(){
    if (this.value! < 0 && !this.negative) this.value = 0

  }


  plusSmall(){
    this.value += 0.5
    this.setValue()
  }

  plusBig(){
    this.value += 5
    this.setValue()
  }


  minusSmall(){
    this.value -= 0.5
  
    this.setValue()
  }

  minusBig(){
    this.value -= 5
    this.setValue()
  }




}
