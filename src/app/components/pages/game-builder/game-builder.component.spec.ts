import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBuilderComponent } from './game-builder.component';

describe('GameBuilderComponent', () => {
  let component: GameBuilderComponent;
  let fixture: ComponentFixture<GameBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
