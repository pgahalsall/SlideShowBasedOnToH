import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

import { SlidesComponent }   from './slides/slides.component';
import { SlideDetailComponent }   from './slide-detail/slide-detail.component';
import { SoundtrackComponent }   from './soundtrack/soundtrack.component';
import { SlideshowComponent }   from './slideshow/slideshow.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'slides', component: SlidesComponent },
  { path: 'slidedetail/:slideId', component: SlideDetailComponent },
  { path: 'soundtrack', component: SoundtrackComponent },
  { path: 'slideshow', component: SlideshowComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
