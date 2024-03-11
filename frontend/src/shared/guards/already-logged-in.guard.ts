import { CanActivateFn } from '@angular/router';
import {AuthService} from "../api/auth";
import {inject} from "@angular/core";

export const alreadyLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn) {
    return false;
  }
  return true;
};
