import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePlayerComponent } from './slideplayer.component';

describe('SlidePlayerComponent', () => {
  let component: SlidePlayerComponent;
  let fixture: ComponentFixture<SlidePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
