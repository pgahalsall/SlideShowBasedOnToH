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
import { AudioplayerComponent }   from './audioplayer/audioplayer.component';

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
  { path: 'audioplayer/:id', component: AudioplayerComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
