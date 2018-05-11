import { Component, OnInit, OnDestroy, EventEmitter, AfterViewChecked, Input, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';
import { EventListener } from '@angular/core/src/debug/debug_node';

import * as $ from 'jquery/dist/jquery.min.js';
//import { interval } from 'rxjs/observable/interval';

import { Subscription } from 'rxjs/subscription';
import { Observable } from 'rxjs/Observable';
import { switchMap, mapTo, scan, startWith, takeWhile } from 'rxjs/operators';

// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/merge';
// import 'rxjs/add/observable/empty';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';


@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})

export class AudioPlayerComponent implements OnInit, AfterViewChecked {
  private _subscriptions = new Subscription();
  private _timer$;
  private _selectedSoundtrackId : number;
  private _selectedSoundtrack : Soundtrack = new Soundtrack();
  private _isPlaying : boolean = false;
  private _song : string = "";
  private _musician : string = "";
  @Output() onAudioElapsedChanged = new EventEmitter<number>();
  @Output() onAudioDurationChanged = new EventEmitter<number>();
  // @Output() onAudio = new EventEmitter<number>();
  @Output() onAudioEnded = new EventEmitter<boolean>();
  @Output() onAudioPlay = new EventEmitter<boolean>();
  @Output() onAudioPause = new EventEmitter<boolean>();
  @Output() onAudioStop = new EventEmitter<boolean>();

  @Output() playObservable = new Observable();

  // selectedSoundtrackId property
  @Input() set selectedSoundtrackId(id: number) {
    if(id) {
    this._selectedSoundtrackId = id;
    this.setSoundtrack(id);
    }
  }
  get selectedSoundtrackId(): number { 
    return this._selectedSoundtrackId; 
  }

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('audioplayer')) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.setSoundtrack(id);

    }
  }

  ngAfterViewChecked() {
  }

  setSoundtrack(id: number) : void {
    const sounds$ = this.soundtrackService
              .getSoundtrackNo404(id)
              .subscribe(st => 
                {
                  this._selectedSoundtrack = st;
                  this._song = st.song;
                  this._musician = st.musician;
                  this.setAudioElementSource(st);
                });

      this._subscriptions.add(sounds$);
  }

  playPauseAudio(): void {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    let playBtnItalic = document.getElementById("btn-play-i");

    //Play/pause the track
    if (audio.paused == false) {
      this.pauseAudio(audio, playBtnItalic);
    } else {
     this.playAudio(audio, playBtnItalic);
    }
  }

  playAudio(audio: HTMLMediaElement, playBtnItalic: HTMLElement) : void {
    if(!this._isPlaying) {
      this._isPlaying = true;
      audio.play();
      playBtnItalic.classList.remove('fa-play');
      playBtnItalic.classList.add('fa-pause');
      this.onAudioPlay.emit(this._isPlaying);

      // const setHTML = id => val => document.getElementById(id).innerHTML = val;
      // //this._timer$.subscribe(this.setHtmlFunc('remaining'));
      // this._timer$.subscribe(setHTML('remaining'));
      // this._subscriptions.add(this._timer$);
    }
  }

  pauseAudio(audio: HTMLMediaElement, playBtnItalic: HTMLElement) : void {
    this._isPlaying = false;
    audio.pause();
    playBtnItalic.classList.remove('fa-pause');
    playBtnItalic.classList.add('fa-play');
    this.onAudioPause.emit(this._isPlaying);
  }

  stopAudio(): void {
    let audio = this.getAudioElement();
    // this.removeEventListeners();

    let stopBtnItalic = document.getElementById("btn-play-i");

    //Stop the track
    audio.pause();
    audio.currentTime = 0;
    stopBtnItalic.classList.remove('fa-pause');
    stopBtnItalic.classList.add('fa-play');

    this._isPlaying = false;
    this.onAudioStop.emit(this._isPlaying);
  }

  // setHtmlFunc(val: any, id: string) : void {
  //   let remain : HTMLElement = document.getElementById(id);
  //   remain.innerHTML = val;
  // }

  // setupPlayObservable(countdownSeconds : number)
  // {
  //   let audio: HTMLMediaElement = this.getAudioElement();

  //   const pauseButton = document.getElementById('btn-play-pause');
  //   const resumeButton = document.getElementById('btn-mute');
  //   const stopButton = document.getElementById('btn-stop');


  //   const setHTML = id => val => (document.getElementById(id).innerHTML = val);
  //   const interval$: any = interval(1000).pipe(mapTo(-1));

  //   const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
  //   const resume$ = fromEvent(resumeButton, 'click').pipe(mapTo(true));

  //   this._timer$ = merge(pause$, resume$)
  //                   .pipe(
  //                         startWith(true),
  //                         switchMap(val => 
  //                           {
  //                             return (val ? interval$ : empty());
  //                           }),
  //                         scan((acc, curr) => {
  //                                               if(curr)
  //                                               {
  //                                                 return curr + acc;
  //                                               }
  //                                               else {
  //                                                 return acc;
  //                                               }
  //                                               //return (curr ? curr + acc : acc);
  //                         }, countdownSeconds),
  //                         takeWhile(v => 
  //                                       {
  //                                         return v >= 0;
  //                                       })
  //                         )
               
  // }

  muteAudio(): void {
    let audio = this.getAudioElement();
    let muteBtnItalic = document.getElementById("btn-mute-i");

    if(audio.volume != 0) {
      audio.volume = 0;
      muteBtnItalic.classList.remove('fa-volume-off');
      muteBtnItalic.classList.add('fa-volume-up');
    } else {
      audio.volume = 1;
      muteBtnItalic.classList.remove('fa-volume-up');
      muteBtnItalic.classList.add('fa-volume-off');
    }
  }


  updateProgressAudio(): void {
      var progress = document.getElementById("progress");
      let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");

      var value = 0;
      if (audio.currentTime > 0) {
        let audioElapsed: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioElapsed");
        let cTimeMins: number = audio.currentTime / 60; 
        audioElapsed.textContent = cTimeMins.toFixed(2);

        value = Math.floor((100 / audio.duration) * audio.currentTime);
      }
      progress.style.width = value + "%";
  }

  getAudioElement(): HTMLMediaElement {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    return audio;
  }

  setAudioElementSource(st: Soundtrack): void {
    let audio = this.getAudioElement();
    
    if((st != null) && (st.filename)) {
      audio.src = st.filename + st.filetype;
      this.addEventListeners();
    }
  }

  /* Allows to change the current time of the song */ 
  setCurrentTime(e: any) {
    let audio = this.getAudioElement();
    var elem = $('#progress-bar');  
    var posX_left = elem.offset().left; 
    var x = e.clientX - posX_left;
    let ratio = x / elem.width();

    let time: number = ratio * audio.duration;
    audio.currentTime = time;

    this.onAudioElapsedChanged.emit(audio.currentTime / audio.duration);
  }

  private metaDataFunc() { };
  private audioEndedFunc() { };

  addEventListeners()
  {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    let childAudio = this;

    function audioUpdated() {
      let audioDuration: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioDuration");
      audioDuration.textContent = (audio.duration / 60).toFixed(2);
      childAudio.onAudioDurationChanged.emit(audio.duration);
    }
    this.metaDataFunc = audioUpdated;

    function audioEnded(): void {
      childAudio.stopAudio();
      childAudio.onAudioEnded.emit(true);
    }
    this.audioEndedFunc = audioEnded;

    this.addEventListener("timeupdate", this.updateProgressAudio);
    this.addEventListener("ended", this.audioEndedFunc);
    this.addEventListener("loadedmetadata", this.metaDataFunc);
  }

  addEventListener(eventName : string, eventFunc: () => void): void {
    let audio = this.getAudioElement();
    audio.addEventListener(eventName, eventFunc, false);
  }

  removeEventListeners() : void {
    this.removeEventListener("timeupdate", this.updateProgressAudio);
    this.removeEventListener("ended", this.audioEndedFunc);
    this.removeEventListener("loadedmetadata", this.metaDataFunc);
  }

  removeEventListener(eventName : string, eventFunc: () => void) : void {
    let audio = this.getAudioElement();
    audio.removeEventListener(eventName, eventFunc, false);
  }

  ngOnDestroy() {
    this.removeEventListeners();
    this.unsubscribe();
  }

  unsubscribe() {
    if(this._subscriptions != null) {
      this._subscriptions.unsubscribe();
    }
  }
}