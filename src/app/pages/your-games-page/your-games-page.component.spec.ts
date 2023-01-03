import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourGamesPageComponent } from './your-games-page.component';

describe('YourGamesPageComponent', () => {
  let component: YourGamesPageComponent;
  let fixture: ComponentFixture<YourGamesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourGamesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourGamesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
