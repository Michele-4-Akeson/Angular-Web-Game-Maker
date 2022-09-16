import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit, AfterViewInit {
  @ViewChild("searchbox") searchbox!:ElementRef
  @Input() items:any[] = []
  @Input() hint?:string
  @Input() boxId!:string
  @Output() onSelect = new EventEmitter<string>()
  searchIcon = faSearch
  searchVisible:boolean = false

  constructor() { }
  ngAfterViewInit(): void {
    this.searchbox?.nativeElement.addEventListener("blur", (e:any)=>{
      this.searchVisible = false
    })
  }

  ngOnInit(): void {
  }

  setVisible(){
    this.searchVisible = !this.searchVisible
    this.searchbox?.nativeElement.focus()
  }

  select($event:any){
    this.searchVisible = false
    this.onSelect.emit($event.target.value)
  }

}
