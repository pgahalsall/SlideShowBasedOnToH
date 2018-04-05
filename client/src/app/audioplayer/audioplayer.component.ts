import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';


@Component({
  selector: 'app-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})

export class AudioplayerComponent implements OnInit, AfterViewChecked {
  filename: string;
  musician: string;
  song: string;

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getSoundtrack();
  }

  ngAfterViewChecked() {
    this.addEventListener();
  }

  getSoundtrack(): void {
      const id = +this.route.snapshot.paramMap.get('id');
      //this.soundtrackService.getSoundtrack(id)
      this.soundtrackService.getSoundtrackNo404(id)
        .subscribe(st => 
          {
            //let f = st.filename.concat('.', st.filetype.toString());
            this.filename = st.filename.concat('.', 'mp3');
            this.musician = st.musician;
            this.song = st.song;
          });
  }

  playPauseAudio(): void {
      let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
      let playBtnItalic = document.getElementById("btn-play-i");

      //Play/pause the track
      if (audio.paused == false) {
        audio.pause();
        playBtnItalic.classList.remove('fa-pause');
        playBtnItalic.classList.add('fa-play');
      } else {
        audio.play();
        playBtnItalic.classList.remove('fa-play');
        playBtnItalic.classList.add('fa-pause');
      }
}

  stopAudio(): void {
        let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
        let stopBtnItalic = document.getElementById("btn-play-i");

        //Stop the track
        audio.pause();
        audio.currentTime = 0;
        stopBtnItalic.classList.remove('fa-pause');
        stopBtnItalic.classList.add('fa-play');
  }

  muteAudio(): void {
    let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
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

  addEventListener(): void {
      let audio: HTMLMediaElement = <HTMLMediaElement>document.getElementById("audioPlayer");
      audio.addEventListener("timeupdate", this.updateProgressAudio, false);
  }

}