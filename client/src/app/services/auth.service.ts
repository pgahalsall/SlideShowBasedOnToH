import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Slideshow } from '../models/slideshow';

import { Observable } from 'rxjs';
// import { shareReplay } from 'rxjs/operators';
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/shareReplay'

import 'rxjs/add/operator/do';
import * as moment from "moment";
import { User } from '../models/user';


@Injectable()
export class AuthService {
    
    private API_URL: string = environment.apiUrl;
    private loginUrl = this.API_URL + 'login';  // URL to web api

    constructor(private http: HttpClient) {

    }

    getAuthorizationToken() {
        //return 'some-auth-token';

        const idToken = localStorage.getItem("id_token");



        return idToken;
    }

    login(email:string, password:string ) {
        return this.http.post<User>(this.loginUrl, {email, password})
            .do(res => this.setSession)
            .shareReplay();
    }
          
    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn,'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    
}
          