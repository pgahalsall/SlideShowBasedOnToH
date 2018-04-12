import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { AudioPlayerComponent }  from '../audioplayer/audioplayer.component';
import { SlidePlayerComponent }  from '../slideplayer/slideplayer.component';

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
  selectedSoundtrackId : number;
  //selectedSlideId : number;
  preloadSlideId : number;
  //slidePosition : number;
  slideIndexer : number;
  slideshowSlides : number[];
  
  slideDuration : number;
  slideshowDuration : string;
  // private tick: number;
  private subscription: Subscription;

  @ViewChild(AudioPlayerComponent)
  private audioPlayerComponent: AudioPlayerComponent;

  @ViewChild(SlidePlayerComponent)
  private slidePlayerComponent: SlidePlayerComponent;

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private slideshowService: SlideshowService,
    private slideService: SlideService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    //this.slideId = 0;
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
            // let soundtrackId = ss.soundtrack;
            
            this.audioPlayerComponent.selectedSoundtrackId = ss.soundtrack;
            //this.slidePlayerComponent.currentSlideId = ss.slides[0];
            this.slideshowSlides = ss.slides;
            this.slideIndexer = 0;
            this.slidePlayerComponent.preloadSlideId = this.slideshowSlides[this.slideIndexer];
          });

  }

  setSlideDuration(audioDuration: number) : void  {
    // 1000 = 1 second
    this.slideDuration = ((audioDuration / this.selectedSlideshow.slides.length) * 1000);
  }

  playSlideshow() : void {
    //this.slideId = 0;
    this.setUpTimer();
  }
  
  stopSlideshow() : void {
    this.slideIndexer = 0;
    //this.tick = 0;

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
        //this.tick = t;
        this.slideIncrementer();
      });

  }

  slideIncrementer() : void {
    if(this.slideIndexer < this.slideshowSlides.length + 1) {
      this.displayNextSlide();
    }
    else {
      this.stopSlideshow();
    }
  }

  displayNextSlide() : void {
    this.slideIndexer++;
    let slideToPreload: number = this.slideshowSlides[this.slideIndexer]
    
    // Start Preloading next slide
    this.slidePlayerComponent.preloadSlideId = slideToPreload;

    // Display the previous Preloaded slide
    this.slidePlayerComponent.displayStagedSlide();
  }

  // preloadNextSlide() : void {
  //   this.slideId++;
  //   //this.slideService.getSlide(this.slideId)
  //   this.slideService.getSlideNo404(this.slideId)
  //   .subscribe(slide => 
  //     {
  //       this.selectedSlide = slide;
  //     });
  // }

  onAudioPlay(isPlaying : boolean) : void {
    if(isPlaying) {
      this.playSlideshow();
    }
  }

  onAudioPause(isPlaying : boolean) : void {
    if(!isPlaying) {
      this.stopSlideshow();
    }
  }

  onAudioStop(isPlaying : boolean) : void {
    if(!isPlaying) {
      this.stopSlideshow();
    }
  }

  onAudioDurationChanged(duration : number) : void {
    let full : number = duration / 60;
    this.slideshowDuration = full.toFixed(2);
    this.setSlideDuration(duration)
  }

  onSlidePreloaded(slideNumber : number) : void {
    if(this.slideIndexer < 2)
    {
      this.displayNextSlide();
    }
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