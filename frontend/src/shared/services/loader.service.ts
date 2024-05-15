import { Injectable } from '@angular/core';
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isFromAuth: boolean = false;
  private loading: boolean = false;

  constructor() { }

  setLoading(loading: boolean, auth?: string) {
    this.isFromAuth = auth === 'auth';
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }

  getIsFromAuth(): boolean {
    return this.isFromAuth;
  }

  getLoadingSubscription() {
    return of (this.loading)
  }
}
