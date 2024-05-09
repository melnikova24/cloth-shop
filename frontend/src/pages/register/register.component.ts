import { Component } from '@angular/core';

import {LoginFormComponent} from "../../features/loginForm/loginForm.component";
import {RegisterFormComponent} from "../../features/registerForm/registerForm.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LoginFormComponent, RegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {}
