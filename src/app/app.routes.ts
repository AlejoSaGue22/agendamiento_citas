import { Routes } from '@angular/router';
import { SignInComponent } from './auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { authenticatedGuard } from './auth/guards/authenticated.guard';
import { notAuthenticatedGuard } from './auth/guards/notAuthenticated.guard';


export const routes: Routes = [
  {
    path:'panel',
    loadChildren: () => import('./modules/panel.routes'),
    canMatch: [authenticatedGuard]
  },
  // Auth pages
  {
    path:'',
    component: SignInComponent,
    title:'Admin Panel - Login',
    canMatch: [notAuthenticatedGuard]
  },
  {
    path:'signup',
    component: SignUpComponent,
    title:'Sign Up',
    canMatch: [notAuthenticatedGuard]
  },
  // error pages
  {
    path:'**',
    component: SignInComponent,
    title:'Admin Panel - Login',
    canMatch: [notAuthenticatedGuard]
  },
];
