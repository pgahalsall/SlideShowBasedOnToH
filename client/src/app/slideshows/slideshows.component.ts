import { Component, OnInit } from '@angular/core';
import { Slideshow } from '../models/slideshow';
import { SlideshowService } from '../services/slideshow.service';

@Component({
  selector: 'app-slideshows',
  templateUrl: './slideshows.component.html',
  styleUrls: [ './slideshows.component.css' ]
})
export class SlideshowsComponent implements OnInit {
  slideshows: Slideshow[] = [];

  constructor(private slideshowService: SlideshowService) { }

  ngOnInit() {
    this.getSlideshows();
  }

  getSlideshows(): void {
    this.slideshowService.getSlideshows()
      .subscribe(slideshows => 
        {
          this.slideshows = slideshows.slice(0, 5);
        });
  }
}
