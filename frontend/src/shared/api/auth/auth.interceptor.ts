import {
  HTTP_INTERCEPTORS, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable, Provider} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private storageService: StorageService) {
  }
  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.storageService.getUser().accessToken;
    req = req.clone({
      withCredentials: true
    })
    if (accessToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}

export const httpInterceptorProviders: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
