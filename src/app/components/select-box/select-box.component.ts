import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit {
  @ViewChild('selectbox') selectbox!:ElementRef 
  @Input() items!:any[]
  @Input() label?:string
  @Input() start?:string
  @Output() onSelect = new EventEmitter<string>()
  constructor() { }

  ngOnInit(): void {
  }


  add(){
    this.onSelect.emit(this.selectbox.nativeElement.value)

  }




}
