import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedGamesPageComponent } from './shared-games-page.component';

describe('SharedGamesPageComponent', () => {
  let component: SharedGamesPageComponent;
  let fixture: ComponentFixture<SharedGamesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedGamesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedGamesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
