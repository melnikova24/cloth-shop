import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../services/storage.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  return storageService.getUser().user.role.includes('admin');
};
