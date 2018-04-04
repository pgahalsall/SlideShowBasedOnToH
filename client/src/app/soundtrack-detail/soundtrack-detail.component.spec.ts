import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundtrackDetailComponent } from './soundtrack-detail.component';

describe('SlideDetailComponent', () => {
  let component: SoundtrackDetailComponent;
  let fixture: ComponentFixture<SoundtrackDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundtrackDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundtrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
