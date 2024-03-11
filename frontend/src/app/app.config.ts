import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { authServiceInitProvider, httpInterceptorProviders} from "../shared/api/auth";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    httpInterceptorProviders,
    authServiceInitProvider
  ]
};
