import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Soundtrack }         from '../models/soundtrack';
import { SoundtrackService }  from '../services/soundtrack.service';

@Component({
  selector: 'app-soundtrack-detail',
  templateUrl: './soundtrack-detail.component.html',
  styleUrls: [ './soundtrack-detail.component.css' ]
})
export class SoundtrackDetailComponent implements OnInit {
  @Input() soundtrack: Soundtrack;

  constructor(
    private route: ActivatedRoute,
    private soundtrackService: SoundtrackService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getSoundtrack();
  }

  getSoundtrack(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    //this.soundtrackService.getSoundtrack(id)
    this.soundtrackService.getSoundtrackNo404(id)
      .subscribe(st => 
        {
          this.soundtrack = st;
        });
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.soundtrackService.updateSoundtrack(this.soundtrack)
      .subscribe(() => this.goBack());
  }
}
