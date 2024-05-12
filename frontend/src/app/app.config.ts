import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { authServiceInitProvider, httpInterceptorProviders} from "../shared/api/auth";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    httpInterceptorProviders,
    authServiceInitProvider,

    // importProvidersFrom(BrowserAnimationsModule),
    provideAnimations()
  ]
};
