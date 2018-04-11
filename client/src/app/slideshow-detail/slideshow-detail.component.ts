import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Slideshow }         from '../models/slideshow';
import { SlideshowService }  from '../services/slideshow.service';

@Component({
  selector: 'app-slideshow-detail',
  templateUrl: './slideshow-detail.component.html',
  styleUrls: [ './slideshow-detail.component.css' ]
})
export class SlideshowDetailComponent implements OnInit {
  @Input() slideshow: Slideshow;

  constructor(
    private route: ActivatedRoute,
    private slideshowService: SlideshowService,
    private location: Location
  ) {}

  ngOnInit(): void {
    if( +this.route.snapshot.pathFromRoot.toString().includes('slideshowdetail')) {
            this.getSlideshow();
      }
  }

  getSlideshow(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    //this.slideshowService.getSlideshow(id)
    this.slideshowService.getSlideshowNo404(id)
      .subscribe(ss => 
        {
          this.slideshow = ss;

        });
  }

  setImageSrc(): void {

  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.slideshowService.updateSlideshow(this.slideshow)
      .subscribe(() => this.goBack());
  }
}
