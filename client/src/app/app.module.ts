import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

// Data Service
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './services/in-memory-data.service';

// Services
import { HeroService }          from './services/hero.service';
import { MessageService }       from './services/message.service';
import { MessagesComponent }    from './messages/messages.component';
import { SlideService }          from './services/slide.service';

// Routing
import { AppRoutingModule }     from './app-routing.module';

// TOH
import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroSearchComponent }  from './hero-search/hero-search.component';

// Slide
import { SlidesComponent } from './slides/slides.component';
import { SlideDetailComponent } from './slide-detail/slide-detail.component';
import { SoundtracksComponent } from './soundtracks/soundtracks.component';
import { SoundtrackDetailComponent } from './soundtrack-detail/soundtrack-detail.component';
import { SlideshowsComponent } from './slideshows/slideshows.component';
import { SlideshowDetailComponent } from './slideshow-detail/slideshow-detail.component';
import { SlideSearchComponent } from './slide-search/slide-search.component';
import { SoundtrackService } from './services/soundtrack.service';
import { SlideshowService } from './services/slideshow.service';

import { AudioPlayerComponent } from './audioplayer/audioplayer.component';
import { SlideshowPlayerComponent } from './slideshowplayer/slideshowplayer.component';
import { SlidePlayerComponent } from './slideplayer/slideplayer.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { MusicPickerComponent } from './musicpicker/musicpicker.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    SlidesComponent,
    SlideDetailComponent,
    SoundtracksComponent,
    SoundtrackDetailComponent,
    SlideshowsComponent,
    SlideshowDetailComponent,
    SlideSearchComponent,
    AudioPlayerComponent,
    SlideshowPlayerComponent,
    SlidePlayerComponent,
    GalleryComponent,
    LoginComponent,
    MusicPickerComponent
  ],
  providers: [ HeroService, MessageService, SlideService, SoundtrackService, SlideshowService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
