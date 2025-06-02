import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './components/shared/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    importProvidersFrom([SweetAlert2Module.forRoot()]),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()), 
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
