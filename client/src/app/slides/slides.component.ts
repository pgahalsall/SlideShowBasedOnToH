import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Slide } from '../models/slide';
import { SlideService } from '../services/slide.service';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: [ './slides.component.css' ]
})
export class SlidesComponent implements OnInit {
  slides: Slide[] = [];

  constructor(
    private slideService: SlideService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if( +this.route.snapshot.pathFromRoot.toString().includes('slides')) {
      this.getSlides();
    }
  }

  getSlides(): void {
    this.slideService.getSlides()
      .subscribe(slides => 
        {
          this.slides = slides.slice(0, 5);
        });
  }
}
