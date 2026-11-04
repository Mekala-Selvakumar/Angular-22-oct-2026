import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withComponentInputBinding())
  ]
};

// withComponentInputBinding is a function that enables component input binding in Angular
// . It allows you to bind data from a parent component to a child component using the @Input decorator.
//  This is useful for passing data between components in a modular and reusable way.
//withComponentInputBinding   :route/query params become component input  