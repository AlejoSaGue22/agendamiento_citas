import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '../../form.utils';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabel { 

  errorType = input.required<AbstractControl>();

    get errorMessage() {
      const errors: ValidationErrors = this.errorType()?.errors || {};

      // console.log(this.errorType())

      return this.errorType()?.touched && Object.keys(errors).length > 0 ? FormUtils.getTextError(errors) : null;
    }
    
}
