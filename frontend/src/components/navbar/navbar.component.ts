import { Component } from '@angular/core';

import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../shared/api/auth";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isOpen = false
  constructor(private authService: AuthService) {
  }

  toggle() {
    this.isOpen = !this.isOpen
  }

  logout() {
    this.authService.logout()
  }

  get isAdmin () {
    return this.authService.isAdmin();
  }

  get isAuth() {
    return this.authService.isLoggedIn;
  }
}
