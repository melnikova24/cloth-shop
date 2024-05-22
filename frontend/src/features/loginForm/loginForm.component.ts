import { Component, OnInit } from '@angular/core';

import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {AuthService} from "../../shared/api/auth";
import {StorageService} from "../../shared/services/storage.service";
import {Router, RouterLink} from "@angular/router";
import {delay} from "rxjs";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './loginForm.component.html',
  styleUrl: './loginForm.component.scss'
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  role: string[] = [];


  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  submitLogin() {
    const {email, password} = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.authService.isLoggedIn = true;
        this.role = this.storageService.getUser().role;
        this.router.navigate(['']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    })
  }
  f (key: string) { return this.loginForm.get(key); }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\d]{8,}$/)]),
    })
  }
}
