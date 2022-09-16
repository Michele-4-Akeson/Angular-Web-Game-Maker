import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorItemComponent } from './decorator-item.component';

describe('DecoratorItemComponent', () => {
  let component: DecoratorItemComponent;
  let fixture: ComponentFixture<DecoratorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecoratorItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecoratorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
