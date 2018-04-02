import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Slide } from '../models/slide';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SlideService {

  private slidesUrl = 'api/slides';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET slides from the server */
  getSlides (): Observable<Slide[]> {
    return this.http.get<Slide[]>(this.slidesUrl)
      .pipe(
        tap(slides => this.log(`fetched slides`)),
        catchError(this.handleError('getSlides', []))
      );
  }

  /** GET slide by id. Return `undefined` when id not found */
  getSlideNo404<Data>(slideId: number): Observable<Slide> {
    const url = `${this.slidesUrl}/?slideId=${slideId}`;
    return this.http.get<Slide[]>(url)
      .pipe(
        map(slides => slides[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} slide slideId=${slideId}`);
        }),
        catchError(this.handleError<Slide>(`getSlide slideId=${slideId}`))
      );
  }

  /** GET slide by id. Will 404 if id not found */
  getSlide(slideId: number): Observable<Slide> {
    const url = `${this.slidesUrl}/${slideId}`;
    return this.http.get<Slide>(url).pipe(
      tap(_ => this.log(`fetched slide slideId=${slideId}`)),
      catchError(this.handleError<Slide>(`getSlide slideId=${slideId}`))
    );
  }

  /* GET slides whose name contains search term */
  searchSlides(term: string): Observable<Slide[]> {
    if (!term.trim()) {
      // if not search term, return empty slide array.
      return of([]);
    }
    return this.http.get<Slide[]>(`api/slides/?name=${term}`).pipe(
      tap(_ => this.log(`found slides matching "${term}"`)),
      catchError(this.handleError<Slide[]>('searchSlides', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new slide to the server */
  addSlide (slide: Slide): Observable<Slide> {
    return this.http.post<Slide>(this.slidesUrl, slide, httpOptions).pipe(
      tap((slide: Slide) => this.log(`added slide w/ slideId=${slide.slideId}`)),
      catchError(this.handleError<Slide>('addSlide'))
    );
  }

  /** DELETE: delete the slide from the server */
  deleteSlide (slide: Slide | number): Observable<Slide> {
    const slideId = typeof slide === 'number' ? slide : slide.slideId;
    const url = `${this.slidesUrl}/${slideId}`;

    return this.http.delete<Slide>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted slide slideId=${slideId}`)),
      catchError(this.handleError<Slide>('deleteSlide'))
    );
  }

  /** PUT: update the slide on the server */
  updateSlide (slide: Slide): Observable<any> {
    return this.http.put(this.slidesUrl, slide, httpOptions).pipe(
      tap(_ => this.log(`updated slide slideId=${slide.slideId}`)),
      catchError(this.handleError<any>('updateSlide'))
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

  /** Log a SlideService message with the MessageService */
  private log(message: string) {
    this.messageService.add('SlideService: ' + message);
  }
}
