import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscriber } from 'src/app/interfaces/Subscriber';
import { EntityService } from 'src/app/services/entity.service';
import { faArrowUpFromBracket, faAdd } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css']
})
export class InspectorComponent implements OnInit, Subscriber, AfterViewInit {
  @ViewChild('previewCanvas') previewCanvas!: ElementRef;
  requireName:boolean = false
  dynamic : boolean = false
  animVisible : boolean = false
  saveIcon = faArrowUpFromBracket
  addIcon = faAdd
  constructor(public entity:EntityService) {
    this.subscribe()

  }

  ngAfterViewInit(): void {
    this.previewCanvas.nativeElement.width = 64
    this.previewCanvas.nativeElement.height = 64

  }
 

  ngOnInit(): void {
    this.dynamic = this.entity.getDynamic()
  }

  setName(e:any){
    this.entity.setName(e.target.value)
  }

  setSize(size:number){
    this.entity.setSize(size)
  }

  setTag(tag:string){
    this.entity.setTag(tag)
  }

  toggleDynamic(active:boolean){
    console.log(active)
    this.entity.setDynamic(active)
  }

  toggleBoxCollider(active:boolean){
    console.log(active)
    this.entity.setBoxCollider(active)
  }

  toggleBoxTrigger(active:boolean){
    console.log(active)
    this.entity.setBoxTriggerActive(active)
  }

  setBoxTriggerSize(size:number){
    this.entity.setBoxTriggerSize(size)
  }

  toggleAnimation(active:boolean){
    this.entity.setAnimationActive(active)
  }

  setSpeed(e:any){
    this.entity.setAnimationSpeed(Number(e.target.value))
  }

  setLeft(e:any){
    this.entity.setAnimationLeft(Number(e.target.value))
  }

  setRight(e:any){
    this.entity.setAnimationRight(Number(e.target.value))
  }

  setUp(e:any){
    this.entity.setAnimationUp(Number(e.target.value))
  }

  setDown(e:any){
    this.entity.setAnimationDown(Number(e.target.value))
  }

  addDecorator(name:string){
    this.entity.addDecorator(name)
    
  }

  saveEntity(){
    if (this.entity.getName()==""){
      this.requireName = true
    } else {
      this.requireName = false
      this.entity.saveEntity()
    }
   
  }

  clearEntity(){
    this.requireName = false
    this.entity.clearEntity()
  }

  draw(size:number){
    let drawer = this.previewCanvas.nativeElement.getContext("2d")
    drawer.clearRect(0, 0, this.previewCanvas.nativeElement.width, this.previewCanvas.nativeElement.height);
    drawer.drawImage(
        this.entity.getImage(),
        this.entity.getAnimation().xFrame * this.entity.getAnimation().frameSize,
        this.entity.getAnimation().yFrame * this.entity.getAnimation().frameSize,
        this.entity.getAnimation().frameSize,
        this.entity.getAnimation().frameSize,
        this.previewCanvas.nativeElement.width/4,
        this.previewCanvas.nativeElement.width/4,
        size,
        size)
  }
  
  subscribe(): void {
    this.entity.addSubscriber(this)
  }
  subscriptionUpdate(): void {
    try{
      this.draw(32)
    } catch (e){
      //console.log(e)
    }
    
  }
  
}
