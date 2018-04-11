import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowPlayerComponent } from './slideshowplayer.component';

describe('SlideshowPlayerComponent', () => {
  let component: SlideshowPlayerComponent;
  let fixture: ComponentFixture<SlideshowPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideshowPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
