import { Component, computed, inject } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notificacion.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent,
    LoaderComponent
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent {

  loader = inject(LoaderService);
  authService = inject(AuthService);
  notificacionService = inject(NotificationService);
  router = inject(Router);
  isLoading = computed(() => this.loader.getLoading());

  onSignIn(value: { email: string, password: string }) {

    if (!value.email || !value.password) return

    this.loader.show();
    const { email, password } = value;

    this.authService.login(email!, password!).subscribe(async (isAuthenticaded) => {
            if (isAuthenticaded.success == true) {
              this.notificacionService.success(
                'Has iniciado sesíon correctamente',
                '¡Bienvenido!',
                3000
              );

              await this.router.navigateByUrl('/panel');
              this.loader.hide();
              return;
            }
                
            this.loader.hide();
            this.notificacionService.error(
              'Credenciales incorrectas. Por favor, intenta nuevamente.',
              'Error de autenticación',
              5000
            );
    })
  }
}
