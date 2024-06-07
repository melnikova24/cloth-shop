import { Component } from '@angular/core';

import {Router, RouterLink, RouterLinkActive} from "@angular/router";
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
  constructor(private authService: AuthService, private router: Router) {
  }

  toggle() {
    this.isOpen = !this.isOpen
  }

  logout() {
    const response = this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/'])
      }
    )
  }

  get isAdmin () {
    return this.authService.isAdmin();
  }

  get isAuth() {
    return this.authService.isLoggedIn;
  }
}
