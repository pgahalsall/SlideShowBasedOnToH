import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetails } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthService) { }

  details:any;

  ngOnInit() {
    this.details = this.auth.getUserProfile()
  }

}
