import { AfterContentInit, Component, inject, signal } from '@angular/core';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { DayDisponiblidad, DisponibilidadFormComponent } from "../disponibilidad-form/disponibilidad-form.component";
import { ServicePersonal, ServiciosFormComponent } from "../servicios-form/servicios-form.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-form-details',
  imports: [SelectComponent, LabelComponent, DisponibilidadFormComponent, ServiciosFormComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './form-details.component.html',
})
export class FormDetails {

    private fb = inject(FormBuilder);

    formPersonal = this.fb.group({
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      correo: ['', Validators.required]
    });
    
    disponibilidad = signal<DayDisponiblidad[]>([]);
    servicios = signal<ServicePersonal[]>([]);

    onDisponibilidadChanged(availability: DayDisponiblidad[]) {
      this.disponibilidad.set(availability);
    }

    onServicioChange(service: ServicePersonal[]){
      this.servicios.set(service);
    }

    onformChange(value: string, input: string){
        if (input == 'rol') {
          this.formPersonal.controls.rol.setValue(value);
        }

        if (input == 'tipoDoc') {
          this.formPersonal.controls.tipoDocumento.setValue(value);
        }
    }

    optionsPersonal = [
      { value: 'marketing', label: 'Personal 1' },
      { value: 'template', label: 'Personal 2' },
      { value: 'development', label: 'Personal 3' },
    ];

    optionsDocumento = [
      { value: 'marketing', label: 'Cedula de ciudadania' },
      { value: 'template', label: 'Tarjeta de Identidad' },
      { value: 'development', label: 'Cedula de Extranjeria' },
    ];
    eventPersonal = '';

    onSubmit() {
        console.log("Value: ", this.formPersonal.value);
        console.log("disponibilidad: ", this.disponibilidad());
        console.log("servicios: ", this.servicios());
    }
 }
