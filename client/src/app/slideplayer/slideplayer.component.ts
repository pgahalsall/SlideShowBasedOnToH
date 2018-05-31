import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  private _displayHeight : number = 0;
  private _stagedSlideNaturalHeight : number = 0;
  private _stagedSlideNaturalWidth : number = 0;
  private _stagedSlideScaledHeight : number = 0;
  private _stagedSlideScaledWidth : number = 0;
  private _imageLoadCount : number = 0;

  // Current
  private _currentSlide : Slide;
  private get currentSlide() : Slide {
    return this._currentSlide;
  }
  private set currentSlide(slide) {
    this._currentSlide = slide;
  }

  // Staged
  private _stagedSlide : Slide;
  private get stagedSlide() : Slide {
    return this._stagedSlide;
  }
  private set stagedSlide(slide) {
    this._stagedSlide = slide;
  }

  // PreLoaded
  private _preloadedSlide : Slide;
  private get preloadedSlide() : Slide {
    return this._preloadedSlide;
  }
  private set preloadedSlide(slide) {
    this._preloadedSlide = slide;
  }


  @Output() onSlidePreloaded = new EventEmitter<number>();
  //@Output() onImageLoaded = new EventEmitter<object>();

  // Current Slide ID
  private _currentSlideId : number = 0;
  @Input() set currentSlideId(id: number) {
    this._currentSlideId = id;
    //this.loadSlide(id);
  }
  get currentSlideId(): number { return this._currentSlideId; }

  // PreLoad Slide ID
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
    this.addEventListeners();
    this.calcDisplayHeight();

    if( +this.route.snapshot.pathFromRoot.toString().includes('slideplayer')) {
      const slideId = +this.route.snapshot.paramMap.keys[0];
      //const slideId = +this.route.snapshot.paramMap.get('slideId');
      this.preloadSlide(slideId);
    }
  }

  preloadSlide(id: number): void {
    this.slideService.getSlide(id)
    //this.slideService.getSlideNo404(slideId)
      .subscribe(slide => 
        {
          // let preloaded: Slide = slide[0];
          let preloaded: Slide = slide;
          this.positionSlideOnLadder(preloaded);
          this.setHiddenImageSource(preloaded.imageUrl);
          this.onSlidePreloaded.emit(preloaded.slideId)
        });
  }

  positionSlideOnLadder(newSlide: Slide) : void {
    if (this.stagedSlide == null) {
      this.stagedSlide = newSlide;
    } else {
      this.preloadedSlide = newSlide;
    }
  }

  displayStagedSlide(): void {
    let currentVisibleImg : HTMLImageElement = this.getImage(false);
    let currentHiddenImg : HTMLImageElement = this.getImage(true);

    // Hide Both
    currentVisibleImg.hidden = true;

    // Shrink images
    currentVisibleImg.height = currentVisibleImg.width = 1;
    currentHiddenImg.height = currentHiddenImg.width = 1;
    
    // Scale image
    this.setImageDimensions(currentHiddenImg, this._stagedSlideScaledHeight, this._stagedSlideScaledWidth);

    // Display previously staged image
    currentHiddenImg.hidden = false;
  }

  setImageDimensions(image: HTMLImageElement, height: number, width: number) : void {
    image.height = height;
    image.width = width;
  }

  setHiddenImageSource(url: string) : void
  {
    let hiddenImage: HTMLImageElement = this.getImage(true);
    hiddenImage.src = url;
   
    this.addEventListeners();
  }

  getImageElement(imageNumber : string): HTMLImageElement {
    let image: HTMLImageElement = <HTMLImageElement>document.getElementById("slideImage" + imageNumber);
    return image;
  }

  calcDisplayHeight() {
    var height = document.documentElement.clientHeight;
    this._displayHeight = height * 0.7;
  }

  getImageById(id: number) : HTMLImageElement {
    return <HTMLImageElement>this.getImageElement(id.toString());
  }

  getImage(isHidden: boolean) : HTMLImageElement {
    let img1 = this.getImageById(1);
    let img2 = this.getImageById(2);

    let img : HTMLImageElement = (img1.hidden == isHidden) ? img1 : img2;
    return img;
  }

  isImageSourceValid(image: HTMLImageElement) : Boolean {
      let src : string = (image == null) ? "" : image.src;
      return ((src.lastIndexOf(".jpg") > 0) || (src.lastIndexOf(".png") > 0) 
           || (src.lastIndexOf(".gif") > 0) || (src.lastIndexOf(".bmp") > 0))
  }

  private metaDataFunc() { };

  addEventListeners()
  {
    let sp = this;
   
    // Cache staged image sizes ready for when the staged image needs to be displayed
    function imageLoaded() {
        // Scale image
        let useHiddenImage : boolean = (sp._imageLoadCount > 0);
        let imageToScale = sp.getImage(useHiddenImage);

        if(sp.isImageSourceValid(imageToScale)) {
            sp._stagedSlideNaturalHeight = imageToScale.naturalHeight;
            sp._stagedSlideNaturalWidth = imageToScale.naturalWidth; 
            let scaling = sp._displayHeight / sp._stagedSlideNaturalHeight;
            sp._stagedSlideScaledHeight = sp._displayHeight;
            sp._stagedSlideScaledWidth = sp._stagedSlideNaturalWidth * scaling;

            if(sp._imageLoadCount < 1)
            {
              sp.setImageDimensions(imageToScale, sp._stagedSlideScaledHeight, sp._stagedSlideScaledWidth);
            }
        }

        sp.removeEventListeners();
        sp._imageLoadCount++;
    }

    this.metaDataFunc = imageLoaded;
    this.addEventListener("load", this.metaDataFunc);
  }

  addEventListener(eventName : string, eventFunc: () => void): void {
    let image = this.getImage(true);
    image.addEventListener(eventName, eventFunc, false);
  }

  removeEventListeners() : void {
     this.removeEventListener("load", this.metaDataFunc);
  }

  removeEventListener(eventName : string, eventFunc: () => void) : void {
    //let image = this.getImage(true);
    let img1 : HTMLImageElement = <HTMLImageElement>this.getImageElement("1");
    let img2 : HTMLImageElement = <HTMLImageElement>this.getImageElement("2");

    if(img1)
      img1.removeEventListener(eventName, eventFunc, false);

    if(img2)
      img2.removeEventListener(eventName, eventFunc, false);
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }
}
