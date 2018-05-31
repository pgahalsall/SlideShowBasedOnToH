import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class MessageService {

  // private API_URL = environment.apiUrl;
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
