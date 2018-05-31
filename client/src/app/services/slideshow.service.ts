import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Slideshow } from '../models/slideshow';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SlideshowService {
  private API_URL = environment.apiUrl;
  //private slideshowsUrl = 'api/slideshows';  // URL to web api
  private slideshowsUrl = this.API_URL + 'slideshows';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET slideshows from the server */
  getSlideshows (): Observable<Slideshow[]> {
    return this.http.get<Slideshow[]>(this.slideshowsUrl)
      .pipe(
        tap(slideshows => this.log(`fetched slideshows`)),
        catchError(this.handleError('getSlideshows', []))
      );
  }

  /** GET slideshow by id. Return `undefined` when id not found */
  getSlideshowNo404<Data>(id: number): Observable<Slideshow> {
    const url = `${this.slideshowsUrl}/?id=${id}`;
    return this.http.get<Slideshow[]>(url)
      .pipe(
        map(slideshows => slideshows[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} slideshow id=${id}`);
        }),
        catchError(this.handleError<Slideshow>(`getSlideshow id=${id}`))
      );
  }

  /** GET slideshow by id. Will 404 if id not found */
  getSlideshow(id: number): Observable<Slideshow> {
    const url = `${this.slideshowsUrl}/${id}`;
    return this.http.get<Slideshow>(url).pipe(
      tap(_ => this.log(`fetched slideshow id=${id}`)),
      catchError(this.handleError<Slideshow>(`getSlideshow id=${id}`))
    );
  }

  /* GET slideshows whose name contains search term */
  searchSlideshows(term: string): Observable<Slideshow[]> {
    if (!term.trim()) {
      // if not search term, return empty slideshow array.
      return of([]);
    }
    return this.http.get<Slideshow[]>(`api/slideshows/?name=${term}`).pipe(
      tap(_ => this.log(`found slideshows matching "${term}"`)),
      catchError(this.handleError<Slideshow[]>('searchSlideshows', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new slideshow to the server */
  addSlideshow (slideshow: Slideshow): Observable<Slideshow> {
    return this.http.post<Slideshow>(this.slideshowsUrl, slideshow, httpOptions).pipe(
      tap((slideshow: Slideshow) => this.log(`added slideshow w/ id=${slideshow.id}`)),
      catchError(this.handleError<Slideshow>('addSlideshow'))
    );
  }

  /** DELETE: delete the slideshow from the server */
  deleteSlideshow (slideshow: Slideshow | number): Observable<Slideshow> {
    const id = typeof slideshow === 'number' ? slideshow : slideshow.id;
    const url = `${this.slideshowsUrl}/${id}`;

    return this.http.delete<Slideshow>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted slideshow id=${id}`)),
      catchError(this.handleError<Slideshow>('deleteSlideshow'))
    );
  }

  /** PUT: update the slideshow on the server */
  updateSlideshow (slideshow: Slideshow): Observable<any> {
    return this.http.put(this.slideshowsUrl, slideshow, httpOptions).pipe(
      tap(_ => this.log(`updated slideshow id=${slideshow.id}`)),
      catchError(this.handleError<any>('updateSlideshow'))
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

  /** Log a SlideshowService message with the MessageService */
  private log(message: string) {
    this.messageService.add('SlideshowService: ' + message);
  }
}
