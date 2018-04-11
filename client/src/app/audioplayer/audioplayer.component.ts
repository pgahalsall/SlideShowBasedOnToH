import { Component, OnInit, EventEmitter, AfterViewChecked, Input, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';
import { EventListener } from '@angular/core/src/debug/debug_node';


@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})

export class AudioPlayerComponent implements OnInit, AfterViewChecked {
  private _activeSoundtrack : Soundtrack = new Soundtrack;

  private _isPlaying : boolean = false;
  @Output() onAudioStatusChanged = new EventEmitter<boolean>();
  @Output() onAudioDurationChanged = new EventEmitter<number>();

  // activeSoundTrack property
  @Input() set ActiveSoundtrack(st: Soundtrack) {
    this._activeSoundtrack = st;
    this.setSoundtrackOnAudio();
  }
  get ActiveSoundtrack(): Soundtrack { 
    return this._activeSoundtrack; 
  }

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getSoundtrack();
  }

  ngAfterViewChecked() {
  }

  getSoundtrack(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('audioplayer')) {
      const id = +this.route.snapshot.paramMap.get('id');
      //this.soundtrackService.getSoundtrack(id)
      this.soundtrackService.getSoundtrackNo404(id)
        .subscribe(st => 
          {
            this.ActiveSoundtrack = st;
           
            this.setSoundtrackOnAudio();
          });
    }
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
    this._isPlaying = true;
    audio.play();
    playBtnItalic.classList.remove('fa-play');
    playBtnItalic.classList.add('fa-pause');
    this.onAudioStatusChanged.emit(this._isPlaying);
  }

  pauseAudio(audio: HTMLMediaElement, playBtnItalic: HTMLElement) : void {
    this._isPlaying = false;
    audio.pause();
    playBtnItalic.classList.remove('fa-pause');
    playBtnItalic.classList.add('fa-play');
    this.onAudioStatusChanged.emit(this._isPlaying);
  }

  stopAudio(): void {
    let audio = this.getAudioElement();
    this.removeEventListeners();

    let stopBtnItalic = document.getElementById("btn-play-i");

    //Stop the track
    audio.pause();
    audio.currentTime = 0;
    stopBtnItalic.classList.remove('fa-pause');
    stopBtnItalic.classList.add('fa-play');

    this._isPlaying = false;
    this.onAudioStatusChanged.emit(false);
  }

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
        value = Math.floor((100 / audio.duration) * audio.currentTime);
      }
      progress.style.width = value + "%";
  }

  getAudioElement(): HTMLMediaElement {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    return audio;
  }

  setSoundtrackOnAudio(): void {
    let audio = this.getAudioElement();
    
    if((this.ActiveSoundtrack != null) && (this.ActiveSoundtrack.filename)) {
      audio.src = this.ActiveSoundtrack.filename + this.ActiveSoundtrack.filetype;
      this.addEventListeners();
    }
  }

  private metaDataFunc() { };

  addEventListeners()
  {
    this.addEventListener("timeupdate", this.updateProgressAudio);

    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
    let childAudio = this;
    // this.addEventListener("loadedmetadata", function() 
    // { 
    //    childAudio.onAudioDurationChanged.emit(audio.duration);
    // });

    function audioUpdated() {
      childAudio.onAudioDurationChanged.emit(audio.duration);
    }
    this.metaDataFunc = audioUpdated;
    this.addEventListener("loadedmetadata", this.metaDataFunc);

  }

  addEventListener(eventName : string, eventFunc: () => void): void {
    let audio = this.getAudioElement();
    audio.addEventListener(eventName, eventFunc, false);
  }

  removeEventListeners() : void {
    this.removeEventListener("timeupdate", this.updateProgressAudio);
     this.removeEventListener("loadedmetadata", this.metaDataFunc);
  }

  removeEventListener(eventName : string, eventFunc: () => void) : void {
    let audio = this.getAudioElement();
    audio.removeEventListener(eventName, eventFunc, false);
  }
}