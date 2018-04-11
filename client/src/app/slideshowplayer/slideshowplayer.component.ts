import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { AudioPlayerComponent }  from '../audioplayer/audioplayer.component';

import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';
import { SlideshowService }  from '../services/slideshow.service';
import { SlideService }  from '../services/slide.service';
import { Slideshow } from '../models/slideshow';
import { Slide } from '../models/slide';

@Component({
  selector: 'app-slideshowplayer',
  templateUrl: './slideshowplayer.component.html',
  styleUrls: ['./slideshowplayer.component.css']
})

export class SlideshowPlayerComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  selectedSlideshow: Slideshow = new Slideshow();
  selectedSlideshowLength : number;
  selectedSoundtrack: Soundtrack = new Soundtrack();
  selectedSlide: Slide = new Slide();
  slideId : number;
  slideDuration : number;
  slideshowDuration : string;
  private tick: number;
  private subscription: Subscription;

  // @ViewChild(AudioPlayerComponent)
  // private audioPlayerComponent: AudioPlayerComponent;

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private slideshowService: SlideshowService,
    private slideService: SlideService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.slideId = 0;
    this.getSlideshow();
  }

  ngAfterViewInit() {
   
  }

  ngAfterViewChecked() {
    
  }

  getSlideshow(): void {
      const id = +this.route.snapshot.paramMap.get('id');
      
      // Get Slideshow
      this.slideshowService.getSlideshow(id)
        .subscribe(ss => 
          {
            this.selectedSlideshow = ss;
            this.selectedSlideshowLength = ss.slides.length;
            let soundtrackId = ss.soundtrack;
            
            // Get soundtrack from it's id
            this.soundtrackService.getSoundtrack(soundtrackId)
            .subscribe(st => 
              {
                this.selectedSoundtrack = st;
    
                //this.setAudioDuration(this.selectedSoundtrack);

                //this.setSlideDuration(this.selectedSlideshow, st.duration);

                this.preloadNextSlide();
              });
          });

  }

  setSlideDuration(audioDuration: number) : void  {
    // 1000 = 1 second
    this.slideDuration = ((audioDuration / this.selectedSlideshow.slides.length) * 1000);
  }

  playSlideshow() : void {
    this.slideId = 0;
    this.setUpTimer();
  }
  
  stopSlideshow() : void {
    this.slideId = 0;
    this.tick = 0;

    //this.slideTimer = null;
    this.stopTimer();
  }

  stopTimer()
  {
    this.unsubscribe();
  }

  setUpTimer() : void {
    let timer = TimerObservable.create(0, this.slideDuration);
    this.subscription = timer.subscribe(t => 
      {
        this.tick = t;
        this.slideIncrementer();
      });

  }

  slideIncrementer() : void {
    let sh:Slideshow = this.selectedSlideshow;
    let slideCount = sh.slides.length;
    if(this.slideId < slideCount) {

      // Start Preloading next slide
      this.preloadNextSlide();

      // Display the previous Preloaded slide

    }
    else
    {
      this.stopSlideshow();
    }
  }

  preloadNextSlide() : void {
    this.slideId++;
    //this.slideService.getSlide(this.slideId)
    this.slideService.getSlideNo404(this.slideId)
    .subscribe(slide => 
      {
        this.selectedSlide = slide;
      });
  }

  onAudioStatusChanged(isPlaying : boolean) : void {
    if(isPlaying) {
      this.playSlideshow();
    }
    else
    {
      this.stopSlideshow();
    }
  }

  onAudioDurationChanged(duration : number) : void {
    let full : number = duration / 60;
    this.slideshowDuration = full.toFixed(2);
    this.setSlideDuration(duration)
  }

  onSlideLoaded(slideNumber : number) : void {
    
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

}