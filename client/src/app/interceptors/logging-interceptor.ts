import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, 
            next: HttpHandler) : Observable<HttpEvent<any>> {

      // Get the auth token from the service.
      const authToken = this.auth.getAuthorizationToken();
    
      return next.handle(req);
    }
}
