export class Carousel {
    container : any;
    carousel : any;
    prev : any;
    next : any;
    play : any;
    slides_container : any;
    slides : any;
    seek_bar : any;
    progress_bar : any;
    choice : any;
    tracks : any;
    track : any;
    speakers : any;
    music : any;
    count : number;
    index : number;
    //progress_ratio : number;
    swipe: number;

    volumeClass:string = 'fas fa-volume-up';
    //playMusic : Boolean = false;

    //constructor(target: HTMLElement)
    constructor(target: any)
    {
        this.container  	    = target;
        this.carousel 		    = this.container.find('.carousel');
        this.prev 	 		    = this.container.find('.prev');
        this.next 		        = this.container.find('.next');
        this.play 		        = this.container.find('.play');
        this.slides_container   = this.container.find('.slides .items');
        this.slides 			= this.slides_container.find('.item');
        this.seek_bar			= this.container.find('.seek-bar');
        this.progress_bar		= this.container.find('.progress-bar');
        this.choice			    = this.container.find('.choice');
        this.tracks 			= this.choice.find('.tracks');
        this.track 			    = this.tracks.find('.track');
        this.speakers			= this.track.find('.speakers');
        this.music			    = this.container.find('.music');
        this.count              = this.slides.length;

        this.index = 0;
        this.swipe = 0;
    };

    controlSpeaker() : string {
        let className: string = "fas fa-volume-up";

        if (this.music[0].volume == 1) {
            this.music[0].volume = 0;
        }
        else {
            this.music[0].volume = 1;
            className = "fas fa-volume-off";
        }

        return className;
    }

    nextSong() {
        this.go_to( this.index + 1, this.index);
    }

    prevSong() {
        this.go_to( this.index - 1, this.index);
    }

    go_to(index, currentIndex) : void {
        if (currentIndex != index) { //Avoid to start over the audio by clicking on the current music and mute the audio
    
            index = index%this.count;
            if (index < 0)
                index = index + this.count;
    
            // Change the background image
            this.setBackground("", index, "png");
    
            /* Make visible or invisible the speakers*/
            this.speakers[currentIndex].classList.add('invisible');
            this.speakers[index].classList.remove('invisible');
    
            /* Change the source of the music */
            this.setSource("", index, ".mp3");

            //this.changeMusic(this.playMusic);
            this.changeMusic(false);
    
            /* Make the scroll follow the current music */
            this.tracks.animate({scrollTop:50*index - 50},300);
    
            /* Animate the slider */ 
            this.animateSlider(index);

            this.index = index;
        }
    }

    animateSlider(index: number) {
        this.slides_container.css({
            transform: "translateX(" + (-225)*index + "px)"
        });
    } 

    setBackground(baseUrl: string, index: number, fileType: string) {
        this.carousel.css({
            "background-image": "url(./assets/images/prototype/backgrounds/background0.png"
        });
    }

    setSource(baseUrl: string, index: number, fileType: string) {
        this.music[0].setAttribute('src', './assets/music/prototype/sounds/TideIsHigh.mp3');
    }

    changeMusic(play: Boolean) : void {	
        /* Play or pause the music */ 	
        if (play == true) {
          this.play[0].classList.add('invisible');
          this.music[0].play();
        }
        else {
          this.play[0].classList.remove('invisible');
          this.music[0].pause();
        }
      }

       

}

