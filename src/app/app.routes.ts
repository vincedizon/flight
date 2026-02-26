import { Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { EventRegisterComponent } from './event-register/event-register.component';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'event-register', component: EventRegisterComponent },
];