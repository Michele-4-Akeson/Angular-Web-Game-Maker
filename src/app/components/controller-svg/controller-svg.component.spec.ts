import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerSvgComponent } from './controller-svg.component';

describe('ControllerSvgComponent', () => {
  let component: ControllerSvgComponent;
  let fixture: ComponentFixture<ControllerSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllerSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
