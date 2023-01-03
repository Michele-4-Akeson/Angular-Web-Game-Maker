import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';


interface point{x:number, y:number, radius:number}
interface eye{x:number, y:number, radius:number, innerEye:SVGSVGElement}
@Component({
  selector: 'app-robot-svg',
  templateUrl: './robot-svg.component.html',
  styleUrls: ['./robot-svg.component.css']
})
export class RobotSVGComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild("octocat") octocat!:ElementRef<SVGSVGElement>
  mouse:DOMPoint | null = null
  restriction:number = 55
  leftEye:eye|null = null
  rightEye:eye|null = null
  leftCenter:Object|null = null
  rightCenter:Object|null = null


  ngAfterViewInit(): void {
    this.mouse = this.octocat.nativeElement.createSVGPoint()
    this.leftEye = this.createEye("#leftEye")
    this.rightEye = this.createEye("#rightEye")
    this.leftCenter = this.getCenterOfSVG("#leftEye")
    this.rightCenter = this.getCenterOfSVG("#rightEye")

    window.addEventListener("mousemove", (e)=>{
      let p = this.getMousePositionInSVG(this.octocat.nativeElement, e)
      this.setCoordinates(this.leftEye!.innerEye, this.leftEye!, p)
      this.setCoordinates(this.rightEye!.innerEye, this.rightEye!, p)
    })
  
    window.addEventListener("mouseout", (e)=>{
      console.log("x")
      gsap.to(this.leftEye!.innerEye, {x:0, y:0})
      gsap.to(this.rightEye!.innerEye, {x:0, y:0})
    })
    
  }

  ngOnDestroy(): void {
    window.removeAllListeners!("mousemove")
    window.removeAllListeners!("mouseout")
}




  
///////////////////////////////////
// EYE MOMENT
//////////////////////////////////



createEye(elementId:string):eye{
    let eye = document.querySelector(elementId)
    let innerEye = eye!.querySelector("#innerEye")! as SVGSVGElement
    let circle = this.getCenterOfSVG(elementId)

    return {...circle, innerEye}
}

getCenterOfSVG(elementId:string):point{
    let svg = document.querySelector(elementId)! as SVGGElement
    let bbox = svg.getBBox()
    let centerX = bbox.x + bbox.width/2
    let centerY = bbox.y + bbox.height/2 
    let radius = Math.min(bbox.width/2, bbox.height/2) - this.restriction
    let center = {x:centerX, y:centerY, radius:radius}
    return center
}




getMousePositionInSVG(svgElement:SVGSVGElement, event:any){
    // gets mouse position within svg
    this.mouse!.x = event.clientX;
    this.mouse!.y = event.clientY;
    // gets the coordinates of the mouse in a given svg relative to that svg
    let svgMousePosition = this.mouse!.matrixTransform(svgElement.getScreenCTM()!.inverse())
    //console.log(svgMousePosition)
    return svgMousePosition
    
}


getAngle(point1:point, point2:DOMPoint){
    // returns angle of point1 from origin, point2 in radians
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;

    let angle = Math.atan2(dy, dx)

    //console.log(angle)

    return angle
}


setCoordinates(svgElement:SVGSVGElement, circle:eye, point:DOMPoint){
    // uses angle of point to determine where within the circle a point would occur, and sets the svg element to that point
    let angle = this.getAngle(circle, point)
    let x = Math.cos(angle) * circle.radius
    let y = Math.sin(angle) * circle.radius
    //console.log(x, y)
    gsap.to(svgElement, {x:x, y:y, duration:0.5})
}




}
