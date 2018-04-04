import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundtracksComponent } from './soundtracks.component';

describe('SoundtrackComponent', () => {
  let component: SoundtracksComponent;
  let fixture: ComponentFixture<SoundtracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundtracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundtracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
