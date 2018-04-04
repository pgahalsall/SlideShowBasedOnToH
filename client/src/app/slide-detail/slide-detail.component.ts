import { Component, OnInit, Input } from '@angular/core';
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
  @Input() slide: Slide;

  constructor(
    private route: ActivatedRoute,
    private slideService: SlideService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getSlide();
  }

  getSlide(): void {
    const slideId = +this.route.snapshot.paramMap.get('slideId');
    this.slideService.getSlide(slideId)
    //this.slideService.getSlideNo404(slideId)
      .subscribe(slide => 
        {
          this.slide = slide[0];
        });
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.slideService.updateSlide(this.slide)
      .subscribe(() => this.goBack());
  }
}
