import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Subject } from "rxjs";
import { Observable } from "rxjs/observable";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { switchMap }  from "rxjs/operators/switchMap";

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
  soundtrackIndexer : number;
  slideshowSoundtracks : number[];

  preloadSlideId : number;
  slideIndexer : number;
  slideshowSlides : number[];
  isSlideJump : Boolean = false;
  slideDuration : number;
  slideshowDuration : string;
  private timerSubscription: Subscription;

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
            
            //this.audioPlayerComponent.selectedSoundtrackId = ss.soundtrack;
            this.soundtrackIndexer = 0;
            this.audioPlayerComponent.selectedSoundtrackId = ss.soundtracks[this.soundtrackIndexer];
            this.slideshowSoundtracks = ss.soundtracks;

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
    this.setUpTimer();
  }
  
  stopSlideshow() : void {
    this.slideIndexer = 0;
    this.stopTimer();
  }

  pauseSlideshow() : void {
    this.stopTimer();
  }

  stopTimer()
  {
    this.unsubscribe();
  }

  setUpTimer() : void {
    let timer = TimerObservable.create(0, this.slideDuration);
    this.timerSubscription = timer.subscribe(t => 
      {
        this.slideIncrementer();
      });

    // const countdownSeconds = 60;
    // const setHTML = id => val => document.getElementById(id).innerHTML = val;
    // const pauseButton = document.getElementById('pause');
    // const resumeButton = document.getElementById('resume');
    // const interval = Observable.interval(1000).mapTo(-1);    // every second
    
    // const pause = Observable.fromEvent(pauseButton, 'click').mapTo(Observable.of(false))
    // const resume = Observable.fromEvent(resumeButton, 'click').mapTo(interval);
    
    // const timer = Observable
    //   .merge(pause, resume)
    //   .startWith(interval)
    //   .switchMap(val => val)
    //   .scan((acc, curr) => curr ? curr + acc : acc, countdownSeconds)
    //   .subscribe(_ => {
    //                     //setHTML('remaining');
    //                     this.slideIncrementer();
    //   });

    
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
    // Display the previous Preloaded slide
    this.slidePlayerComponent.displayStagedSlide();

    // Start Preloading next slide and set hidden image source
    this.slideIndexer++;
    this.preloadSlide();
  }

  preloadSlide() : void {
    if(this.slideIndexer < this.slideshowSlides.length) {
      let slideToPreload: number = this.slideshowSlides[this.slideIndexer]
      this.slidePlayerComponent.preloadSlideId = slideToPreload;
    }
  }

  onAudioPlay(isPlaying : boolean) : void {
    if(isPlaying) {
      this.playSlideshow();
    }
  }

  onAudioPause(isPlaying : boolean) : void {
    if(!isPlaying) {
      //this.stopSlideshow();
      this.pauseSlideshow();
    }
  }

  onAudioStop(isPlaying : boolean) : void {
    if(!isPlaying) {
      this.stopSlideshow();
    }
  }

  onAudioEnded(ended : boolean) : void {
    if(ended) {
       this.stopSlideshow();
    }
  }

  onAudioDurationChanged(duration : number) : void {
    let full : number = duration / 60;
    this.slideshowDuration = full.toFixed(2);
    this.setSlideDuration(duration)
  }

  onAudioElapsedChanged(fractionalPosition : number) : void {
    // Calculate slide index based on fractionalPosition
    let slideCount: number = this.slideshowSlides.length;
    let newSlideIndex = Number((slideCount * fractionalPosition).toFixed(0));
    this.slideIndexer = newSlideIndex;
    this.isSlideJump = true;

    this.preloadSlide();
  }

  onSlidePreloaded(slideNumber : number) : void {
    if((this.slideIndexer < 1) || this.isSlideJump)
    {
      this.isSlideJump = false;
      this.displayNextSlide();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if(this.timerSubscription != null) {
      this.timerSubscription.unsubscribe();
    }
  }

}