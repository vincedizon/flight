import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import this
import { provideNativeDateAdapter } from '@angular/material/core'; // Helpful for your Datepicker

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(), // Required for SnackBar/Modals to work
    provideNativeDateAdapter() // Since you are using MatDatepicker in your component
  ]
};