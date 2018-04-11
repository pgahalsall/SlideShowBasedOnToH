import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Slide }         from '../models/slide';
import { SlideService }  from '../services/slide.service';

@Component({
  selector: 'app-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: [ './slide-detail.component.css' ]
})
export class SlideDetailComponent implements OnInit {
  private PLACEHOLDER: string = "./assets/images/c-transparent.jpg";
  private _currentSlide : Slide = new Slide();
  //@Input() slide: Slide;
  @Output() onSlideLoaded = new EventEmitter<number>();

  @Input() set currentSlide(st: Slide) {
    this._currentSlide = st;
    this.setImageDetails();
  }
  get currentSlide(): Slide { return this._currentSlide; }


  constructor(
    private route: ActivatedRoute,
    private slideService: SlideService,
    private location: Location
  ) {}

  ngOnInit(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('slidedetail')) {
      this.getSlide();
    }
  }

  getSlide(): void {
    const slideId = +this.route.snapshot.paramMap.get('slideId');
    this.slideService.getSlide(slideId)
    //this.slideService.getSlideNo404(slideId)
      .subscribe(slide => 
        {
          this._currentSlide = slide[0];
          this.setImageDetails();
        });
  }

  setImageDetails(): void {
    let imgSrc = <HTMLImageElement>this.getImageElement();
    if(imgSrc != null) {
      if((this._currentSlide != null) && (this._currentSlide.imageUrl)) {
        imgSrc.src = this._currentSlide.imageUrl;
        // imgSrc.width = this._currentSlide.slideWidth;
        // imgSrc.height = this._currentSlide.slideHeight;
      }
      else
      {
        this.setDummyImage(imgSrc)
      }
    }
  }

  setDummyImage(imgSrc: HTMLImageElement): void {
    imgSrc.src = this.PLACEHOLDER;
    // imgSrc.width = 500;
    // imgSrc.height = 500;
  }

  getImageElement(): HTMLImageElement {
    let image: HTMLImageElement = <HTMLImageElement>document.getElementById("slideImage");
    return image;
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.slideService.updateSlide(this._currentSlide)
      .subscribe(() => this.goBack());
  }

  // updateImageDimensions()
  // {
  //   let image: HTMLImageElement = <HTMLImageElement>document.getElementById("slideImage");
  //   //image.height = 
  // }
  
  private metaDataFunc() { };
  addEventListeners()
  {
    let image: HTMLImageElement = <HTMLImageElement>document.getElementById("slideImage");
    let sd = this;

    function imageLoaded() {
      //sd.setImageDetails();
      sd.onSlideLoaded.emit(sd._currentSlide.slideId);
    }

    this.metaDataFunc = imageLoaded;
    this.addEventListener("onload", this.metaDataFunc);

  }

  addEventListener(eventName : string, eventFunc: () => void): void {
    let image = this.getImageElement();
    image.addEventListener(eventName, eventFunc, true);
  }

  removeEventListeners() : void {
    this.removeEventListener("onload", this.metaDataFunc);
  }

  removeEventListener(eventName : string, eventFunc: () => void) : void {
    let image = this.getImageElement();
    image.removeEventListener(eventName, eventFunc, false);
  }
}
