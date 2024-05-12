import { Component } from '@angular/core';

import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../shared/api/auth";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private authService: AuthService) {
  }

  get isAdmin () {
    return this.authService.isAdmin();
  }
}
