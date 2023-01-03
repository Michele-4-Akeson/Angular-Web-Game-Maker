import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';
@Component({
  selector: 'app-controller-svg',
  templateUrl: './controller-svg.component.html',
  styleUrls: ['./controller-svg.component.css']
})
export class ControllerSvgComponent implements OnInit, AfterViewInit {
  @ViewChild('controller') controller!:ElementRef
  timeline = gsap.timeline({paused:true, repeat:-1, yoyo:true})
  @Input() text?:string = ""

  constructor() { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.timeline.add(this.pressButton("#yellowButton", "yellow", "#edd551"))
    .add(this.pressButton("#yellowButton", "yellow", "#edd551"))
    .add(this.pressButton("#blueButton", "blue", "#51ede4"))
    .add(this.pressButton("#triggers", "purple", "#df99ff"))
    .add(this.pressButton("#triggers", "purple", "#df99ff"))
    .add(this.pressButton("#redButton", "red", "#ed5159"))
    .add(this.pressButton("#greenButton", "green", "#77ed51"))
    .add(this.pressButton("#redButton", "red", "#ed5159"))

    this.controller.nativeElement.addEventListener("mouseenter", ()=>{
      this.timeline.play()
  
  })
  
  this.controller.nativeElement.addEventListener("mouseleave", ()=>{
      this.timeline.restart()
      this.timeline.pause()
  
  })
  
    
  }





  pressButton(id:string, color:string, orignal:string){
    let timeline = gsap.timeline();
    timeline
    .to(id, {duration:0.4, y:0.5, stroke:color})
    .to(id, {duration:0.1, y:0, stroke:orignal});

    return timeline;
  }

}
