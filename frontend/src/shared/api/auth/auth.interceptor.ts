import {
  HTTP_INTERCEPTORS, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {inject, Injectable, Provider} from "@angular/core";
import {catchError, delay, finalize, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {LoaderService} from "../../services/loader.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private storageService: StorageService, private loaderService: LoaderService) {
  }

  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loaderService.setLoading(true);
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
      ,
      finalize(() => {
        this.loaderService.setLoading(false)
        // if (req.url === "http://localhost:5000/api/login") {
        //   setTimeout(() => this.loaderService.setLoading(false), 5000);
        // } else {
        //   // this.loaderService.setLoading(false)
        // }
      })
    );
  }
}

export const httpInterceptorProviders: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
