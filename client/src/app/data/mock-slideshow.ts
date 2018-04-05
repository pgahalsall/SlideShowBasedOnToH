import { Slideshow } from '../models/slideshow';

export const SLIDESHOWS: Slideshow[] = [
  { id: 11, title: 'First Slideshow', producer: 'first producer', description: 'holiday slideshow', slides: [1], soundtrack: 12, updated_date: Date.parse('January 1, 1970') },
  { id: 12, title: 'Second Slideshow', producer: 'second producer', description: 'france slideshow', slides: [1], soundtrack: 13, updated_date: Date.parse('January 1, 1970') },
  { id: 13, title: 'Third Slideshow', producer: 'third producer', description: 'spain slideshow', slides: [2], soundtrack: 11, updated_date: Date.parse('January 1, 1970') },
];
