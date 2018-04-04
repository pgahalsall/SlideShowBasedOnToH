import { SoundTypeEnum } from '../shared/soundtypeenum';

export class Soundtrack {
    id: number;
    song: string;
    musician: string;
    filename: string;
    filetype: SoundTypeEnum;
    release_date: number;
    updated_date: number;
}

