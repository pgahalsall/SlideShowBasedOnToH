import { InMemoryDbService } from 'angular-in-memory-web-api';
import { SoundTypeEnum } from '../shared/soundtypeenum';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    //return {heroes};
    const slides = [
      { slideId: 1, slideName: 'Mr. Pete', slideCode: 'GDN-0011X', takenDate:'June 19, 2017', caption:'A photo caption 1.', slideHieght:'100', slideWidth:'100', imageUrl:'http://www.peterhalsall.com/images/Lights%20-square.jpg' },
      { slideId: 2, slideName: 'Mr. Nice', slideCode: 'GDN-0011XX', takenDate:'June 20, 2017', caption:'A photo caption 2.', slideHieght:'100', slideWidth:'100', imageUrl:'http://www.peterhalsall.com/images/Liverpool%20street%20sign-%20banner.jpg' },
      { slideId: 3, slideName: 'Mr. Guy', slideCode: 'GDN-0011XXX', takenDate:'June 21, 2017', caption:'A photo caption 3.', slideHieght:'100', slideWidth:'100', imageUrl:'http://www.peterhalsall.com/images/Tube%20sign%20square.jpg' },
    ];

    const soundtracks = [
      { id: 11, song: 'First Song', musician: 'first musician', filename: 'firsttrack', filetype: SoundTypeEnum.mp3, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
      { id: 12, song: 'Second Song', musician: 'second musician', filename: 'secondtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
      { id: 13, song: 'Third Song', musician: 'third musician', filename: 'thirdtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
      { id: 14, song: 'Forth Song', musician: 'forth musician', filename: 'forthtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
    ];

    const slideshows = [
      { id: 11, title: 'First Slideshow', producer: 'first producer', description: 'holiday slideshow', slides: [1], soundtrack: 12, updated_date: Date.parse('January 1, 1970') },
      { id: 12, title: 'Second Slideshow', producer: 'second producer', description: 'france slideshow', slides: [1], soundtrack: 13, updated_date: Date.parse('January 1, 1970') },
      { id: 13, title: 'Third Slideshow', producer: 'third producer', description: 'spain slideshow', slides: [2], soundtrack: 11, updated_date: Date.parse('January 1, 1970') },
    ];

    return {heroes, slides, soundtracks, slideshows}
  }
}
