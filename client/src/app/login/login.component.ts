import { Component, OnInit }  from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService }  from '../services/auth.service';
import { RouterModule, Routes, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form:FormGroup;

  constructor(private fb:FormBuilder, 
    private authService: AuthService, 
    private router: Router) {

      this.form = this.fb.group({
          username: ['',Validators.required],
          password: ['',Validators.required],
          remember: [false]
          });
  }

  ngOnInit() {
  }

  login() {
    const val = this.form.value;
    if (val.username && val.password) {
        this.authService
            .login(val.username, val.password)
            .subscribe(
                (token) => {
                    if(token) {
                        console.log("User is logged in");
                        this.router.navigateByUrl('/gallery');
                    }
                    else {
                        console.log("User login failed");
                        this.router.navigateByUrl('/login');
                    }
                }
            );
        }
  }

  loginWithGoogle() {
    const val = this.form.value;
    console.log("Trying to login with Google");

    this.authService.loginViaGoogle()
        .subscribe(
            () => {
                console.log("User is logged in");
                this.router.navigateByUrl('/gallery');
            }
        );
  }
}
