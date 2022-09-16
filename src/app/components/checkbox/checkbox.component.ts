import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() label!:string
  @Input() isChecked!:boolean
  @Output() onCheck = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit(): void {
  }


  checked(){
    this.isChecked = !this.isChecked
    this.onCheck.emit(this.isChecked)

  }

}
