import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateGamesPageComponent } from './private-games-page.component';

describe('PrivateGamesPageComponent', () => {
  let component: PrivateGamesPageComponent;
  let fixture: ComponentFixture<PrivateGamesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateGamesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateGamesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
