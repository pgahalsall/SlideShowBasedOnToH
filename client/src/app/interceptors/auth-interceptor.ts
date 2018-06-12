import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, 
            next: HttpHandler) : Observable<HttpEvent<any>> {

    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();
    let notExpired: boolean = this.auth.isUserLoggedIn;
    if (authToken && notExpired) {

        // Clone the request and set the new header in one step.
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
    else {
      if(req.url.indexOf('google') > 0) {
        // const headers = new HttpHeaders({
        //   'Access-Control-Allow-Headers': '*'
        // });
        // const authReq = req.clone({ setHeaders: { Acc: authToken } });

        // const authReq = req.clone();
        // authReq.headers.set('Access-Control-Allow-Headers', '*')
        const authReq = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });

    
        // send cloned request with header to the next handler.
        return next.handle(authReq);
      }
      else {
        return next.handle(req);
      }
    }
  }
}
