import {APP_INITIALIZER, Injectable, Provider} from '@angular/core';
import {BASE_URL} from "../../constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private storageService: StorageService, private router: Router) { }

  login(email: string, password: string) {
      return this.http.post(BASE_URL+'/login', {email, password}, httpOptions);
  }

  register(email: string, password: string, name: string) {
      return this.http.post(BASE_URL+'/register', {email, password, name}, httpOptions);
  }

  refresh() {
      return this.http.get(BASE_URL+'/refresh', httpOptions);
  }

  logout() {
      return this.http.post(BASE_URL+'/logout', {}, httpOptions);
  }

  init() {
      this.refresh().subscribe({
          next: data => {
              this.storageService.saveUser(data);
              this.isLoggedIn = true;
              this.router.navigate(['']);
          },
          error: err => {
              this.storageService.clear();
              this.isLoggedIn = false;
          }
      })
  }

  isAdmin() {
    return this.storageService.getUser().role.includes('admin');
  }
}

export const authServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => authService.init(),
  deps: [AuthService],
  multi: true,
};
