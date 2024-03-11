import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../shared/api/auth";
import {StorageService} from "../../shared/services/storage.service";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registerForm.component.html',
  styleUrl: './registerForm.component.scss'
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  role: string[] = [];


  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  submitRegister() {
    const {email, password, name} = this.registerForm.value;
    this.authService.register(email, password, name).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.storageService.getUser().role;
        this.router.navigate(['']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    })
  }
  f (key: string) { return this.registerForm.get(key); }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'name': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\d]{8,}$/)]),
    })
  }
}
