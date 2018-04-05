import { Component, OnInit } from '@angular/core';
import { Soundtrack } from '../models/soundtrack';
import { SoundtrackService } from '../services/soundtrack.service';

@Component({
  selector: 'app-soundtracks',
  templateUrl: './soundtracks.component.html',
  styleUrls: [ './soundtracks.component.css' ]
})
export class SoundtracksComponent implements OnInit {
  soundtracks: Soundtrack[] = [];

  constructor(private soundtrackService: SoundtrackService) { }

  ngOnInit() {
    this.getSoundtracks();
  }

  getSoundtracks(): void {
    this.soundtrackService.getSoundtracks()
      .subscribe(soundtracks => 
        {
          this.soundtracks = soundtracks.slice(0, 5);
        });
  }

  // add(song: string): void {
  //   song = song.trim();
  //   if (!song) { return; }
  //   this.soundtrackService.addSoundtrack({ song } as Soundtrack)
  //     .subscribe(s => {
  //       this.soundtracks.push(s);
  //     });
  // }

  delete(st: Soundtrack): void {
    this.soundtracks = this.soundtracks.filter(h => h !== st);
    this.soundtrackService.deleteSoundtrack(st).subscribe();
  }
}
