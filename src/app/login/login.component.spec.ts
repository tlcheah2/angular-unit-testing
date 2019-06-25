import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { LoginService } from '../service/login.service';
import { validUser, blankUser } from 'src/mocks';
import { RouterTestingModule } from '@angular/router/testing';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);

const testUserData = { id: 1, name: 'TekLoon'};
const loginErrorMsg = 'Invalid Login';

describe('Login Component Isolated Test', () => {
  let component: LoginComponent;

  beforeEach(async(() => {
    component = new LoginComponent(routerSpy, new FormBuilder(), loginServiceSpy);
  }));

  function updateForm(userEmail, userPassword) {
    component.loginForm.controls['username'].setValue(userEmail);
    component.loginForm.controls['password'].setValue(userPassword);
  }

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.invalid).toBeTruthy();
    expect(component.authError).toBeFalsy();
    expect(component.authErrorMsg).toBeUndefined();
  });

  it('submitted should be true when onSubmit()', () => {
    component.onSubmit(blankUser);
    expect(component.submitted).toBeTruthy();
    expect(component.authError).toBeFalsy();
  });

  it('form value should update from when u change the input', (() => {
    updateForm(validUser.username, validUser.password);
    expect(component.loginForm.value).toEqual(validUser);
  }));

  it('Form invalid should be true when form is invalid', (() => {
    updateForm(blankUser.username, blankUser.password);
    expect(component.loginForm.invalid).toBeTruthy();
  }));
});

describe('Login Component Shallow Test', () => {

  let fixture: ComponentFixture<LoginComponent>;

  function updateForm(userEmail, userPassword) {
    fixture.componentInstance.loginForm.controls['username'].setValue(userEmail);
    fixture.componentInstance.loginForm.controls['password'].setValue(userPassword);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule],
      providers: [
        {provide: LoginService, useValue: loginServiceSpy},
        FormBuilder,
        { provide: Router, useValue: routerSpy }
      ],
      declarations: [LoginComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
  }));

  it('created a form with username and password input and login button', () => {
    // const fixture = TestBed.createComponent(LoginComponent);
    const usernameContainer = fixture.debugElement.nativeElement.querySelector('#username-container');
    const passwordContainer = fixture.debugElement.nativeElement.querySelector('#password-container');
    const loginBtnContainer = fixture.debugElement.nativeElement.querySelector('#login-btn-container');
    expect(usernameContainer).toBeDefined();
    expect(passwordContainer).toBeDefined();
    expect(loginBtnContainer).toBeDefined();
  });

  it('Display Username Error Msg when Username is blank', () => {
    updateForm(blankUser.username, validUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('Please enter username');
  });

  it('Display Password Error Msg when Username is blank', () => {
    updateForm(validUser.username, blankUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');
    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('Please enter password');
  });

  it('Display Both Username & Password Error Msg when both field is blank', () => {
    updateForm(blankUser.username, blankUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('#username-error-msg');
    const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');

    expect(usernameErrorMsg).toBeDefined();
    expect(usernameErrorMsg.innerHTML).toContain('Please enter username');

    expect(passwordErrorMsg).toBeDefined();
    expect(passwordErrorMsg.innerHTML).toContain('Please enter password');
  });

  it('When username is blank, username field should display red outline ', () => {
    updateForm(blankUser.username, validUser.password);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');
    const usernameInput = inputs[0];

    expect(usernameInput.classList).toContain('is-invalid');
  });

  it('When password is blank, password field should display red outline ', () => {
    updateForm(validUser.username, blankUser.password);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');
    const passwordInput = inputs[1];

    expect(passwordInput.classList).toContain('is-invalid');
  });
});

describe('Login Component Integrated Test', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let loginSpy;
  function updateForm(userEmail, userPassword) {
    fixture.componentInstance.loginForm.controls['username'].setValue(userEmail);
    fixture.componentInstance.loginForm.controls['password'].setValue(userPassword);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        {provide: LoginService, useValue: loginServiceSpy},
        FormBuilder,
        { provide: Router, useValue: routerSpy }
      ],
      declarations: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    // router = TestBed.get(Router);

    loginSpy = loginServiceSpy.login.and.returnValue(Promise.resolve(testUserData));

  }));

  it('loginService login() should called ', fakeAsync(() => {
    updateForm(validUser.username, validUser.password);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(loginServiceSpy.login).toHaveBeenCalled();
  }));

  it('should route to home if login successfully', fakeAsync(() => {
    updateForm(validUser.username, validUser.password);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    advance(fixture);

    loginSpy = loginServiceSpy.login.and.returnValue(Promise.resolve(testUserData));
    advance(fixture);

    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    // expecting to navigate to id of the component's first hero
    expect(navArgs).toBe('/home', 'should nav to Home Page');
  }));
  function advance(f: ComponentFixture<any>) {
    tick();
    f.detectChanges();
  }
});
