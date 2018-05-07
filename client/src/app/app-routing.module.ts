import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

import { SlidesComponent }   from './slides/slides.component';
import { SlideDetailComponent }   from './slide-detail/slide-detail.component';
import { SoundtracksComponent }   from './soundtracks/soundtracks.component';
import { SoundtrackDetailComponent }   from './soundtrack-detail/soundtrack-detail.component';
import { SlideshowsComponent }   from './slideshows/slideshows.component';
import { SlideshowDetailComponent }   from './slideshow-detail/slideshow-detail.component';
import { AudioPlayerComponent }   from './audioplayer/audioplayer.component';
import { SlidePlayerComponent }   from './slideplayer/slideplayer.component';
import { SlideshowPlayerComponent }   from './slideshowplayer/slideshowplayer.component';
import { GalleryComponent }   from './gallery/gallery.component';
import { LoginComponent }   from './login/login.component';
import { MusicPickerComponent }   from './musicpicker/musicpicker.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'slides', component: SlidesComponent },
  { path: 'slidedetail/:slideId', component: SlideDetailComponent },
  { path: 'soundtracks', component: SoundtracksComponent },
  { path: 'soundtrackdetail/:id', component: SoundtrackDetailComponent },
  { path: 'slideshows', component: SlideshowsComponent },
  { path: 'slideshowdetail/:id', component: SlideshowDetailComponent },
  { path: 'audioplayer/:id', component: AudioPlayerComponent },
  { path: 'slideplayer/:id', component: SlidePlayerComponent },
  { path: 'slideshowplayer/:id', component: SlideshowPlayerComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'musicpicker', component: MusicPickerComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
