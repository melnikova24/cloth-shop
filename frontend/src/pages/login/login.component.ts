import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginFormComponent} from "../../features/loginForm/loginForm.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {}
