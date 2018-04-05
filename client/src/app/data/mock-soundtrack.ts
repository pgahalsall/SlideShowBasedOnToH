import { Soundtrack } from '../models/soundtrack';
import { SoundTypeEnum } from '../shared/soundtypeenum';

export const SOUNDTRACKS: Soundtrack[] = [
  { id: 11, song: 'First Song', musician: 'first musician', filename: 'TideIsHigh', filetype: SoundTypeEnum.mp3, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
  { id: 12, song: 'Second Song', musician: 'second musician', filename: 'secondtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
  { id: 13, song: 'Third Song', musician: 'third musician', filename: 'thirdtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
  { id: 14, song: 'Forth Song', musician: 'forth musician', filename: 'forthtrack', filetype: SoundTypeEnum.wav, updated_date: Date.parse('January 1, 1970'), release_date: Date.parse('January 1, 1970') },
];
