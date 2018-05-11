import { Component, OnInit } from '@angular/core';
import { Carousel } from '../shared/MusicCarousel';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'app-musicpicker',
  templateUrl: './musicpicker.component.html',
  styleUrls: ['./musicpicker.component.css']
})

export class MusicPickerComponent implements OnInit {
  musicCarousel : Carousel;
  _playMusic : Boolean = false;
  _progress_ratio : number = 0;

  public volumeClass = 'fas fa-volume-off';

  constructor() { }

    ngOnInit() {  

      this.musicCarousel = new Carousel($('.container '));

      this.init_events();
    }

    init_events() {
      var that = this;
      
      /* On click on the next and prev button, swipe the carousel */ 
      this.musicCarousel.next.on('click', function(){
          that._playMusic = false;
          that.musicCarousel.nextSong();
          return false;
      });

      this.musicCarousel.prev.on('click', function(){
          that._playMusic = false;
          that.musicCarousel.prevSong();
          return false;
      });

      /* We click on one track name, change to that music and that image */ 
      this.musicCarousel.track.each(function (data) {
        $(this).on('click', function (){
              that._playMusic = false;
              that.musicCarousel.go_to( data, that.musicCarousel.index);
          });
      });

      document.addEventListener('keydown', (evt) => {
        if (evt.which == 39) {
            that._playMusic = false;
            that.musicCarousel.nextSong();
            return false;
        }
        if (evt.which == 37) {
            that._playMusic = false;
            that.musicCarousel.prevSong();
            return false;
        }
        if (evt.which == 32) {
            that._playMusic = !that._playMusic;
            that.musicCarousel.changeMusic(that._playMusic);
            return false;
        }
      });
      
      /* CHECK WHEN WE PAUSE BY CLICKING ON THE IMAGE */
      this.musicCarousel.play.on('click', function(){
            that._playMusic = !that._playMusic;
            that.musicCarousel.changeMusic(that._playMusic);
            return false;
      });

      this.musicCarousel.speakers.on('click', function(){
            that.volumeClass = that.musicCarousel.controlSpeaker();
      });

      /* CHECK WHEN THE MUSIC ENDS */ 
      this.musicCarousel.music.bind('ended', function(){
          that._playMusic = false;
          that.musicCarousel.nextSong();
      });

      /* FOR THE TOUCH CONTROL */
      this.musicCarousel.carousel.on('touchstart',function(e){
          that.musicCarousel.swipe = e.originalEvent.touches[0].clientX;
      });

      this.musicCarousel.carousel.on('touchend',function(e){
          that._playMusic = false;
          if (e.originalEvent.changedTouches[0].clientX > that.musicCarousel.swipe + 10)
              that.musicCarousel.prevSong();
          else if (e.originalEvent.changedTouches[0].clientX < that.musicCarousel.swipe - 10)
              that.musicCarousel.nextSong();
          /* The + / - 10 allows to not swipe when we touch the screen without purpose*/
      });

       /**** SEEK BAR ****/
      window.setInterval(function () {
          this._progress_ratio = that.musicCarousel.music[0].currentTime / that.musicCarousel.music[0].duration;
          that.musicCarousel.progress_bar.css({
          transform: "scaleX(" + this._progress_ratio + ")"
          });
      }, 50);

      /* Allows to change the current time of the song */ 
      this.musicCarousel.seek_bar.on('click', function (e) {
              var x = e.clientX - that.musicCarousel.seek_bar.offset().left,
              ratio = x / that.musicCarousel.seek_bar.width(),
              time = ratio * that.musicCarousel.music[0].duration;
          that.musicCarousel.music[0].currentTime = time;
      });

      that.musicCarousel.setSource("", that.musicCarousel.index, ".mp3");
      this.musicCarousel.changeMusic(false);
};




}
