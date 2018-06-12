import { Component, OnInit } from '@angular/core';
import { AuthService }  from '../services/auth.service';
import { RouterModule, Routes, Router } from '@angular/router';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit() {
  }

  logout() {
    console.log("User is logging out");
    this.authService.logout()
    this.router.navigateByUrl('/login');
  }
}
