import {CanActivateFn, CanDeactivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../api/auth";

export const authActivate: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true
};


