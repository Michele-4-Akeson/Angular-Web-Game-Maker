import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotSVGComponent } from './robot-svg.component';

describe('RobotSVGComponent', () => {
  let component: RobotSVGComponent;
  let fixture: ComponentFixture<RobotSVGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotSVGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotSVGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
