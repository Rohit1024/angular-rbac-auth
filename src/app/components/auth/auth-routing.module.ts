import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/auth/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/auth']);
const redirectLoggedInToPasswordReset = () =>
  redirectLoggedInTo(['/auth/reset-password']);
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        ...canActivate(redirectLoggedInToHome),
      },
      {
        path: 'register',
        component: RegisterComponent,
        ...canActivate(redirectLoggedInToHome),
      },
      {
        path: 'profile',
        component: ProfileComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'reset-password',
        component: PasswordResetComponent,
        ...canActivate(redirectLoggedInToPasswordReset),
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
        ...canActivate(redirectLoggedInToHome)
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
