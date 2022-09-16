import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteSelectorComponent } from './sprite-selector.component';

describe('SpriteSelectorComponent', () => {
  let component: SpriteSelectorComponent;
  let fixture: ComponentFixture<SpriteSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpriteSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpriteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
