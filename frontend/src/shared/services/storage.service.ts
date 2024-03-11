import { Injectable } from '@angular/core';


const USER_KEY = 'auth-user';
const sessionStorage = window.sessionStorage;
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clear(): void {
    sessionStorage.clear();
  }

  saveUser(user: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {}
  }

  // public isLoggedIn(): boolean {
  //   const user = window.sessionStorage.getItem(USER_KEY);
  //   return !!user;
  // }
}
