import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, 
            next: HttpHandler) : Observable<HttpEvent<any>> {

    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();

    if (authToken) {

        // Clone the request and set the new header in one step.
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
    else {
      return next.handle(req);
    }
  }
}
