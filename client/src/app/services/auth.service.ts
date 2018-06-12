import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Slideshow } from '../models/slideshow';
import { MessageService } from './message.service';

import { Observable } from 'rxjs';
// import { shareReplay } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/shareReplay'
import { catchError, map, tap } from 'rxjs/operators';

import 'rxjs/add/operator/do';
import * as moment from "moment";
import { User } from '../models/user';


export interface UserDetails {
    _id: string;
    email: string;
    name: string;
    exp: number;
    iat: number;
  }

  interface TokenResponse {
    token: string;
  }
  
  export interface TokenPayload {
    email: string;
    password: string;
    name?: string;
  }
  

const httpOptions = {
    //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token' })
  };


@Injectable()
export class AuthService {
    
    private API_URL: string = environment.apiUrl;
    private profileUrl = this.API_URL + 'auth/profile';  
    private localLoginUrl = this.API_URL + 'auth/local';  // URL to local
    private googleLoginUrl = this.API_URL + 'auth/google';  // URL to google
    private _currentUser = null;

    constructor(private http: HttpClient, 
                private messageService: MessageService,
                private router: Router) {
       
    }

    public get Username(): boolean {
        if(!this._currentUser && this.isUserLoggedIn) {
            let user: UserDetails = this.getUserDetails();
            this._currentUser = user.name;
        }
        return this._currentUser;
    }
    
    private getUserDetails(): UserDetails {
        const token = this.getAuthorizationToken();
        let payload;
        if (token) {
            payload = token.split('.')[1];
            payload = window.atob(payload);
            return JSON.parse(payload);
        } 
        else {
            return null;
        }
    }

    getAuthorizationToken() {
        let token = localStorage.getItem('id_token');
        return token;
    }

    // public saveToken(token: string): void {
    //     localStorage.setItem('id_token', token);
    //   }
    

    
    public getUserProfile(): UserDetails {
        let userProfile: UserDetails = null;
        if(this.isUserLoggedIn)
        {
            userProfile = this.getUserDetails();
        }

        return userProfile;
        // return this.http.get<any>(this.profileUrl)
        // .do(res => 
        //     {
        //         this.log("fetched user profile");
        //         // res.header('Access-Control-Allow-Origin', '*');
        //         // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        //         // res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        //         //this.setSession;
        //     })
    }

    loginViaGoogle (): Observable<any> {
        return this.http.get<any>(this.googleLoginUrl, httpOptions)
        //return this.http.get<any>(this.googleLoginUrl)
        //return this.http.post<any>(this.googleLoginUrl, { })
        .do(res => 
            {
                // res.header('Access-Control-Allow-Origin', '*');
                // res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
                // res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
                this.setSession;
            })
      }

      login(email:string, password:string): Observable<string> {
        return this.http.post<string>(this.localLoginUrl, {email, password})
          .pipe(
            tap(authRes => {
                            this.log(`fetched token for user=${email}`);
                            this.setSession(authRes);

                            // let user: UserDetails = this.getUserDetails();
                            // this._currentUser = user.name;
            }),
            catchError(this.handleError<string>(`login email=${email}`))
          );
      }
          
    private setSession(authResult) {
        const expiresAt = authResult.tokenpayload.expires_at;
        localStorage.setItem('id_token', authResult.tokenpayload.token);
        localStorage.setItem("expires_at", expiresAt);
    }          

    public logout() {
        this._currentUser = null;
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");

        this.router.navigateByUrl('/login');
    }

    public isLoggedIn() {
        const isBefore = moment().isBefore(this.getExpiration());
        return isBefore;
    }

    
    public get isUserLoggedIn(): boolean {
        // Check if current date is before token expiration and user is signed in locally
        const isLoggedIn = this.isLoggedIn();
        return isLoggedIn;
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        return moment(expiration);
    }    

    /** Log a SlideService message with the MessageService */
    private log(message: string) {
        this.messageService.add('SlideService: ' + message);
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
}
          