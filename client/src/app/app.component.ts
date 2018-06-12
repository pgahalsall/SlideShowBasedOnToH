import { Component } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule }    from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  title = 'Slideshow Angular';
}
