import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Soundtrack } from '../models/soundtrack';
import { MessageService } from './message.service';

import { HandleError } from '../services/httperrorhandler.service'
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SoundtrackService {
  private API_URL = environment.apiUrl;
  //private soundtracksUrl = 'api/soundtracks';  // URL to web api
  private soundtracksUrl = this.API_URL + 'soundtracks';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET soundtracks from the server */
  getSoundtracks (): Observable<Soundtrack[]> {
    return this.http.get<Soundtrack[]>(this.soundtracksUrl)
      .pipe(
        tap(soundtracks => this.log(`fetched soundtracks`)),
        catchError(this.handleError('getSoundtracks', []))
      );
  }

  /** GET soundtrack by id. Return `undefined` when id not found */
  getSoundtrackNo404<Data>(id: number): Observable<Soundtrack> {
    const url = `${this.soundtracksUrl}/?id=${id}`;
    return this.http.get<Soundtrack[]>(url)
      .pipe(
        map(soundtracks => soundtracks[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} soundtrack id=${id}`);
        }),
        catchError(this.handleError<Soundtrack>(`getSoundtrack id=${id}`))
      );
  }

  /** GET soundtrack by id. Will 404 if id not found */
  getSoundtrack(id: number): Observable<Soundtrack> {
    const url = `${this.soundtracksUrl}/${id}`;
    return this.http.get<Soundtrack>(url).pipe(
      tap(_ => this.log(`fetched soundtrack id=${id}`)),
      catchError(this.handleError<Soundtrack>(`getSoundtrack id=${id}`))
    );
  }

  /* GET soundtracks whose name contains search term */
  searchSoundtracks(term: string): Observable<Soundtrack[]> {
    if (!term.trim()) {
      // if not search term, return empty soundtrack array.
      return of([]);
    }
    return this.http.get<Soundtrack[]>(`api/soundtracks/?name=${term}`).pipe(
      tap(_ => this.log(`found soundtracks matching "${term}"`)),
      catchError(this.handleError<Soundtrack[]>('searchSoundtracks', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new soundtrack to the server */
  addSoundtrack (soundtrack: Soundtrack): Observable<Soundtrack> {
    return this.http.post<Soundtrack>(this.soundtracksUrl, soundtrack, httpOptions).pipe(
      tap((soundtrack: Soundtrack) => this.log(`added soundtrack w/ id=${soundtrack.id}`)),
      catchError(this.handleError<Soundtrack>('addSoundtrack'))
    );
  }

  /** DELETE: delete the soundtrack from the server */
  deleteSoundtrack (soundtrack: Soundtrack | number): Observable<Soundtrack> {
    const id = typeof soundtrack === 'number' ? soundtrack : soundtrack.id;
    const url = `${this.soundtracksUrl}/${id}`;

    return this.http.delete<Soundtrack>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted soundtrack id=${id}`)),
      catchError(this.handleError<Soundtrack>('deleteSoundtrack'))
    );
  }

  /** PUT: update the soundtrack on the server */
  updateSoundtrack (soundtrack: Soundtrack): Observable<any> {
    return this.http.put(this.soundtracksUrl, soundtrack, httpOptions).pipe(
      tap(_ => this.log(`updated soundtrack id=${soundtrack.id}`)),
      catchError(this.handleError<any>('updateSoundtrack'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a SoundtrackService message with the MessageService */
  private log(message: string) {
    this.messageService.add('SoundtrackService: ' + message);
  }
}
