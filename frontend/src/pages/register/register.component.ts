import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginFormComponent} from "../../features/loginForm/loginForm.component";
import {RegisterFormComponent} from "../../features/registerForm/registerForm.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {}
