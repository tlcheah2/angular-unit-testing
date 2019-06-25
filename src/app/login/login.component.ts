import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;
  loginForm: FormGroup;
  authError = false;
  authErrorMsg: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(loginData) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const userloginBody = {
      username: loginData.username,
      password: loginData.password
    };
    // Pending API call and logic handling
    this.loginService.login(userloginBody)
      .then(() => {
        // Successfully login
        this.router.navigateByUrl('/home');
      })
      .catch((reason) => {
        // Failed login
        this.authError = true;
        this.authErrorMsg = reason;
      });
  }

}
