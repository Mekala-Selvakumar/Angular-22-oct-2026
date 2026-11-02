import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalInterceptor, MsalService } from '@azure/msal-angular';
import { MSALGuardConfigFactory, MSALInstanceFactory, MSALInterceptorConfigFactory } from './auth/msal.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
        provideHttpClient(
      withInterceptorsFromDi()
    ),

    // Register MSAL HTTP interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },

    // MSAL instance
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },

    // MSAL Guard configuration
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },

    // MSAL Interceptor configuration
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },

    MsalService,

    MsalGuard,

    MsalBroadcastService

  ]

  
};
