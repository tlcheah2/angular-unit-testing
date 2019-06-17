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

  submitted: boolean;
  loginForm: FormGroup;

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

  ngOnInit() {
    this.submitted = false;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(loginData) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    // Pending API call and logic handling
    this.loginService.login();
    this.router.navigate(['/home']);
  }

}
