import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Slide }         from '../models/slide';
import { SlideService }  from '../services/slide.service';

@Component({
  selector: 'app-slideplayer',
  templateUrl: './slideplayer.component.html',
  styleUrls: [ './slideplayer.component.css' ]
})
export class SlidePlayerComponent implements OnInit {
  private PLACEHOLDER: string = "./assets/images/prototype/c-transparent.jpg";
  private _currentSlide : Slide;
  private _stagedSlide : Slide;
  private _preloadedSlide : Slide;

  @Output() onSlidePreloaded = new EventEmitter<number>();

  // Current Slide
  private _currentSlideId : number = 0;
  @Input() set currentSlideId(id: number) {
    this._currentSlideId = id;
    //this.loadSlide(id);
  }
  get currentSlideId(): number { return this._currentSlideId; }

  // PreLoad Slide
  private _preloadSlideId : number = 0;
  @Input() set preloadSlideId(id: number) {
    this._preloadSlideId = id;
    this.preloadSlide(id);
  }
  get preloadSlideId(): number { return this._preloadSlideId; }

  constructor(
    private route: ActivatedRoute,
    private slideService: SlideService,
    private location: Location
  ) {}

  ngOnInit(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('slideplayer')) {
      const slideId = +this.route.snapshot.paramMap.get('slideId');
      this.preloadSlide(slideId);
    }
  }

  preloadSlide(id: number): void {
    this.slideService.getSlide(id)
    //this.slideService.getSlideNo404(slideId)
      .subscribe(slide => 
        {
          let preloaded: Slide = slide[0];
          this.positionSlideOnLadder(preloaded);
          this.onSlidePreloaded.emit(preloaded.slideId)
        });
  }

  isLadderPopulated()
  {
    return (this._currentSlide != null) && (this._stagedSlide != null) && (this._preloadedSlide != null)
  }

  positionSlideOnLadder(newSlide: Slide) : void {
    if(this.isLadderPopulated() == true) {
      this.promoteSlides(newSlide);
    }
    else {
      this.positionSlideTopDown(newSlide)
    }
  }

  promoteSlides(newSlide: Slide) : void {
    this._currentSlide = this._stagedSlide;
    this._stagedSlide = this._preloadedSlide;
    this._preloadedSlide = newSlide;
  }

  positionSlideTopDown(newSlide: Slide) : void {
    if(this._currentSlide == null) {
      this._currentSlide = newSlide;
    }
    else if (this._stagedSlide == null) {
      this._stagedSlide = newSlide;
    } else {
      this._preloadedSlide = newSlide;
    }
  }

  displayStagedSlide(): void {
    let img1 : HTMLImageElement = <HTMLImageElement>this.getImageElement("1");
    let img2 : HTMLImageElement = <HTMLImageElement>this.getImageElement("2");

    // let previouslyHidden : string = this.getHiddenImage();
    let currentHidden : HTMLImageElement = (img1.hidden == true) ? img1 : img2;
    let currentVisible : HTMLImageElement = (img1.hidden == false) ? img1 : img2;

    // Hide Both
    currentVisible.hidden = true;

    // Set details for both
    this.setImageDetails(currentVisible, this._stagedSlide.imageUrl, 1, 1);
    this.setImageDetails(currentHidden, this._currentSlide.imageUrl, this._currentSlide.slideHeight, this._currentSlide.slideWidth);

    // Toggle visibility
    currentHidden.hidden = false;
  }

  setImageDetails(image: HTMLImageElement, url: string, height: number, width: number) : void
  {
    image.height = height;
    image.width = width;
    image.src = url;
  }

  getImageElement(imageNumber : string): HTMLImageElement {
    let image: HTMLImageElement = <HTMLImageElement>document.getElementById("slideImage" + imageNumber);
    return image;
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.slideService.updateSlide(this._currentSlide)
      .subscribe(() => this.goBack());
  }

}
