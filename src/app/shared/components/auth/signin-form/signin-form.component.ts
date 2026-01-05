import { CommonModule } from '@angular/common';
import { Component, computed, inject, output } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notificacion.service';
import { FormErrorLabel } from "../../../../utils/components/form-error-label/form-error-label.component";

interface FormLogin {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorLabel
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  private fb = inject(FormBuilder);
  notificationService = inject(NotificationService);
  showPassword = false;
  isChecked = false;
  valueForm = output<FormLogin>()

  formAuth = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onformChange(value: string | number, input: string){
      const event = value.toString();
        if (input == 'email') {
          this.formAuth.controls.email.setValue(event);
        }

        if (input == 'password') {
          this.formAuth.controls.password.setValue(event);
        }
    }

  onSignIn() {
    const valid = this.formAuth.valid;
    this.formAuth.markAllAsTouched();

    if (!valid) {
      this.notificationService.error(
          'Complete todos los campos',
          'Formulario inválido',
          5000
      );
      return
    }
    
    const value = this.formAuth.value;
    this.valueForm.emit(value as FormLogin);
    
  }
}
