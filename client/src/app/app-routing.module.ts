import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

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
import { ProfileComponent }   from './profile/profile.component';
import { MusicPickerComponent }   from './musicpicker/musicpicker.component';
import { AuthGuardService } from './services/authguard.service';

const routes: Routes = [
  // Public paths
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Private paths
  { path: 'slides', 
    component: SlidesComponent,
    canActivate: [AuthGuard] },
  { path: 'slidedetail/:slideId', 
    component: SlideDetailComponent,
    canActivate: [AuthGuard] },
  { path: 'soundtracks', 
    component: SoundtracksComponent,
    canActivate: [AuthGuard] },
  { path: 'soundtrackdetail/:id', 
    component: SoundtrackDetailComponent,
    canActivate: [AuthGuard] },
  { path: 'slideshows', 
    component: SlideshowsComponent,
    canActivate: [AuthGuard] },
  { path: 'slideshowdetail/:id', 
    component: SlideshowDetailComponent,
    canActivate: [AuthGuard] },
  { path: 'audioplayer/:id', 
    component: AudioPlayerComponent,
    canActivate: [AuthGuard] },
  { path: 'slideplayer/:id', 
    component: SlidePlayerComponent,
    canActivate: [AuthGuard] },
  { path: 'slideshowplayer/:id', 
    component: SlideshowPlayerComponent,
    canActivate: [AuthGuard] },
  { path: 'gallery', 
    component: GalleryComponent,
    canActivate: [AuthGuard] },
  { path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] },
  { path: 'musicpicker', 
    component: MusicPickerComponent,
    canActivate: [AuthGuard] }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  providers: [AuthGuard],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
