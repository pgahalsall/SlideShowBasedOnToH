import { InMemoryDbService } from 'angular-in-memory-web-api';
import { environment } from '../../environments/environment';
import { SoundTypeEnum } from '../shared/soundtypeenum';

import { Soundtrack } from '../models/soundtrack';
import { Slideshow } from '../models/slideshow';
import { Slide } from '../models/slide';

import { SLIDES } from '../data/mock-slides';
import { SLIDESHOWS } from '../data/mock-slideshow';
import { SOUNDTRACKS } from '../data/mock-soundtrack';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    
    let slides: Slide[] = SLIDES;
    let soundtracks: Soundtrack[] = SOUNDTRACKS;
    let slideshows: Slideshow[] = SLIDESHOWS;

    return {slides, soundtracks, slideshows}
  }
}
