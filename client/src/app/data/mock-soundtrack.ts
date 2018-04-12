import { Soundtrack } from '../models/soundtrack';
import { SoundTypeEnum } from '../shared/soundtypeenum';

export const SOUNDTRACKS: Soundtrack[] = [
  { id: 11, song: 'Tide is High', musician: 'Blondie', filename: './assets/music/prototype/TideIsHigh', filetype: SoundTypeEnum.mp3, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970'), duration: 0 },
  { id: 12, song: 'Second Song', musician: 'second musician', filename: '/assets/music/prototype/TideIsHigh', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970'), duration: 0 },
  { id: 13, song: 'Third Song', musician: 'third musician', filename: 'assets/music/prototype/TideIsHigh', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970'), duration: 0 },
  { id: 14, song: 'Forth Song', musician: 'forth musician', filename: './assets/music/prototype/TideIsHigh', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970'), duration: 0 },
];
