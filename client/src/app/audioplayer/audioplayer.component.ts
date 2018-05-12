import { Component, OnInit, OnDestroy, EventEmitter, AfterViewChecked, Input, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';
import { AudioChangeEnum } from '../shared/AudioChangeEnum';
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
  private _soundtracks: Soundtrack[] = new Array<Soundtrack>(2);
  private _timer$;
  private _selectedSoundtrackId : number;
  private _selectedSoundtrackIds : number[];
  private _selectedSoundtrack : Soundtrack = new Soundtrack();
  private _isPlaying : boolean = false;
  private _song : string = "";
  private _musician : string = "";
  private _audioPosition : AudioChangeEnum = AudioChangeEnum.Even;
  @Output() onAudioElapsedChanged = new EventEmitter<number>();
  @Output() onAudioDurationChanged = new EventEmitter<number>();
  // @Output() onAudio = new EventEmitter<number>();
  @Output() onAudioEnded = new EventEmitter<boolean>();
  @Output() onAudioPlay = new EventEmitter<boolean>();
  @Output() onAudioPause = new EventEmitter<boolean>();
  @Output() onAudioStop = new EventEmitter<boolean>();
  @Output() playObservable = new Observable();

  
  // selectedSoundtrackId property
  @Input() set selectedSoundtrackIds(ids: number[]) {
    if(ids && (ids.length > 0)) {
      this._selectedSoundtrackIds = ids;
      this._selectedSoundtrackId = ids[0];
      this.loadSoundtracks(ids);
      //this.setSoundtrackSource(this._selectedSoundtrackId);
    }
  }
  get selectedSoundtrackIds(): number[] { 
    return this._selectedSoundtrackIds; 
  }

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('audioplayer')) {
      const id = +this.route.snapshot.paramMap.get('id');
      //this.setSoundtrackSource(id);
      this._selectedSoundtrackId = id;
      this.loadSoundtrack(id, 0);
    }
  }

  ngAfterViewChecked() {
  }

  loadSoundtracks(ids: number[]) : void {
    ids.forEach((i) => {
      //let isFirst: Boolean = ids.indexOf(i) === 0;
      let index: number = ids.indexOf(i);
      this.loadSoundtrack(i, index);
    })
  }

loadSoundtrack(id: number, index: number) : void {
    const sounds$ = this.soundtrackService
    .getSoundtrackNo404(id)
    .subscribe(st => 
      {
          //this._soundtracks.push(st);
          let isFirst: Boolean = index === 0;
          if(index === 0) {
            this.setAudioElementSource(st, 0.0);
          }
          this._soundtracks[index] = st;
      });

      this._subscriptions.add(sounds$);
  }


  // setSoundtrackSource(id: number) : void {
  //   const sounds$ = this.soundtrackService
  //             .getSoundtrackNo404(id)
  //             .subscribe(st => 
  //               {
  //                 this._selectedSoundtrack = st;
  //                 this._song = st.song;
  //                 this._musician = st.musician;
  //                 this.setAudioElementSource(st);
  //               });

  //     this._subscriptions.add(sounds$);
  // }

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



  getAudioElement(): HTMLMediaElement {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    return audio;
  }

  setAudioElementSource(sound: Soundtrack, startTime: number): void {
    this.removeEventListeners();
    let audio = this.getAudioElement();
    
    if((sound != null) && (sound.filename)) {
      this._selectedSoundtrackId = sound.id;
      this._selectedSoundtrack = sound;

      audio.src = sound.filename + sound.filetype;
      audio.currentTime = startTime;

      this._musician = sound.musician;
      this._song = sound.song;

      // if(startTime <= 0) {
        this.addEventListeners();
      // }
    }
  }

  // jumpingSongs(time: number) : Boolean {
  //   let firstDuration: number = this._soundtracks[0].duration;
    
  //   if(this.getCurrentSoundtrackIndex() < 1) 
  //     return (time > firstDuration);

  //   return (time < firstDuration);
  // }

  getAudioPosition(time: number) : AudioChangeEnum {
    let firstDuration: number = this._soundtracks[0].duration;
    //let secondDuration: number = this._soundtracks[1].duration;
    let currentIndex: number = this.getCurrentSoundtrackIndex();

    if(currentIndex === 0)
    {
      this._audioPosition = (firstDuration <= time) ? AudioChangeEnum.Plus : AudioChangeEnum.Even;
    }
    else
    {
      this._audioPosition = (firstDuration > time) ? AudioChangeEnum.Minus : AudioChangeEnum.Even;
    }

    return this._audioPosition;
  }

   /* Allows to change the current time of the song */ 
   setCurrentTime(e: any) {
    let audio = this.getAudioElement();
    audio.pause();

    var elem = $('#progress-bar');  
    var posX_left = elem.offset().left; 
    var x = e.clientX - posX_left;
    let ratio = x / elem.width();

    let totalDuration: number = this.getTotalDuration();
    let time: number = ratio * totalDuration;
    let elapsedTime: number = 0;

    // Jump to a different soundtrack ?
    let audioPosition: AudioChangeEnum = this.getAudioPosition(time);
    if(audioPosition === AudioChangeEnum.Minus)
    {
      // Prev Track 
      this.setAudioElementSource(this.getPrevSoundtrack(), time);
      elapsedTime = time;
    }
    else if(audioPosition === AudioChangeEnum.Plus) {
      // Next Track
      let timeIntoNextSong: number = time - this._soundtracks[0].duration;
      this.setAudioElementSource(this.getNextSoundtrack(), timeIntoNextSong);
      elapsedTime =  this._soundtracks[0].duration + timeIntoNextSong;
    }
    else{
      // Track unchanged
      let currentIndex: number = this.getCurrentSoundtrackIndex();
      if(currentIndex === 0)
      {
        audio.currentTime = elapsedTime = time;
      }
      else
      {
        elapsedTime = time;
        audio.currentTime = time - this._soundtracks[0].duration;
      }
    }
    this.onAudioElapsedChanged.emit(elapsedTime / totalDuration);
    
    audio.play();
  }

  getTotalDuration() : number {
    let duration : number = 0;
    this._soundtracks.forEach((st) => {
      duration = duration + st.duration;
    })
    return duration;
  }

  getCurrentSoundtrackIndex() : number {
    return this.selectedSoundtrackIds.indexOf(this._selectedSoundtrackId);
  }

  getLastSoundtrackIndex() : number {
    return this._selectedSoundtrackIds.length - 1;
  }

  getNextSoundtrack(): Soundtrack {
    let currentIndex = this.getCurrentSoundtrackIndex();
    let lastIndex = this.getLastSoundtrackIndex();
    if(currentIndex === lastIndex) 
      return null;

    let nextSoundtrack = this._soundtracks[currentIndex + 1];
    return nextSoundtrack;
  }

  getPrevSoundtrack(): Soundtrack {
    let currentIndex = this.getCurrentSoundtrackIndex();
    let lastIndex = this.getLastSoundtrackIndex();
    if(currentIndex === lastIndex) 
      return this._soundtracks[currentIndex - 1];

    return null;
  }

  private metaDataFunc() { };
  private audioEndedFunc() { };
  private updateProgressFunc() { };

  addEventListeners()
  {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    let childAudio = this;

    // Audio Updated
    function audioUpdated() {
      let audioDuration: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioDuration");

      audioDuration.textContent = (childAudio.getTotalDuration() / 60).toFixed(2);
      //audioDuration.textContent = (audio.duration / 60).toFixed(2);
      //childAudio.onAudioDurationChanged.emit(audio.duration);
      let total: number = childAudio.getTotalDuration();
      childAudio.onAudioDurationChanged.emit(total);
    }
    this.metaDataFunc = audioUpdated;

    // Audio Ended
    function audioEnded(): void {
      let nextSoundtrack = childAudio.getNextSoundtrack();
      //let lastIndexPlayed = childAudio.selectedSoundtrackIds.indexOf(childAudio._selectedSoundtrackId);
      //let lastIndex = childAudio._selectedSoundtrackIds.length - 1;
      if(nextSoundtrack) {
        // Play next track
        //let nextSoundtrack = childAudio._soundtracks[lastIndexPlayed + 1];
        // childAudio._selectedSoundtrackId = nextSoundtrack.id;
        childAudio.setAudioElementSource(nextSoundtrack, 0.0);

        let totalDuration: number = childAudio.getTotalDuration();
        let elapsedTime: number =  childAudio._soundtracks[0].duration;
        childAudio.onAudioElapsedChanged.emit(elapsedTime / totalDuration);

        audio.play();
      }
      else {
        // Has last track played
        childAudio.stopAudio();
        childAudio.setAudioElementSource(childAudio._soundtracks[0], 0.0);
        childAudio.onAudioEnded.emit(true);
      }
    }
    this.audioEndedFunc = audioEnded;

    // Audio Progress
    function updateProgressAudio(): void {
      var progress = document.getElementById("progress");
      let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");

      var value = 0;
      if (audio.currentTime > 0) {
        let audioElapsed: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioElapsed");
        
        //audioElapsed.textContent = cTimeMins.toFixed(2);

        //value = Math.floor((100 / audio.duration) * audio.currentTime);
        let totalDuration: number = childAudio.getTotalDuration();

        if(childAudio.getCurrentSoundtrackIndex() === 0) {
          // first song
          // let cTimeMins: number = audio.currentTime / 60; 
          audioElapsed.textContent = (audio.currentTime / 60).toFixed(2);
          value = Math.floor((100 / totalDuration) * audio.currentTime);
        }
        else
        {
          // second song
          let firstDuration = childAudio._soundtracks[0].duration;
          audioElapsed.textContent = ((firstDuration + audio.currentTime) / 60).toFixed(2);
          value = Math.floor((100 / totalDuration) * (firstDuration + audio.currentTime));
        }
      }
      progress.style.width = value + "%";
    }

  
    this.updateProgressFunc = updateProgressAudio;

    this.addEventListener("timeupdate", this.updateProgressFunc);
    this.addEventListener("ended", this.audioEndedFunc);
    this.addEventListener("loadedmetadata", this.metaDataFunc);
  }

  addEventListener(eventName : string, eventFunc: () => void): void {
    let audio = this.getAudioElement();
    audio.addEventListener(eventName, eventFunc, false);
  }

  removeEventListeners() : void {
    this.removeEventListener("timeupdate", this.updateProgressFunc);
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