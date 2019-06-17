import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { LoginService } from '../service/login.service';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule],
      providers: [
        LoginService,
        FormBuilder,
        {provide: Router, useValue: routerSpy}
      ],
      declarations: [ LoginComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });


});
