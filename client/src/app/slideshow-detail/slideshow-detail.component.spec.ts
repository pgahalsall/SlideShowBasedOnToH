import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowDetailComponent } from './slideshow-detail.component';

describe('SlideshowDetailComponent', () => {
  let component: SlideshowDetailComponent;
  let fixture: ComponentFixture<SlideshowDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideshowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
