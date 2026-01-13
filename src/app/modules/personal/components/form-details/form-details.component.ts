import { AfterContentInit, Component, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { DayDisponiblidad, DisponibilidadFormComponent } from "../disponibilidad-form/disponibilidad-form.component";
import { ServiciosFormComponent } from "../servicios-form/servicios-form.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, tap } from 'rxjs';
import { PersonalService } from '../../../../services/personal.service';
import { PersonalInterface, ServicePersonal } from '../../interfaces/personal-interface';
import { NotificationService } from '../../../../shared/services/notificacion.service';
import { FormErrorLabel } from "../../../../utils/components/form-error-label/form-error-label.component";
import { LoaderService } from '../../../../shared/services/loader.service';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";


@Component({
  selector: 'app-form-details',
  imports: [SelectComponent, LabelComponent, DisponibilidadFormComponent, ServiciosFormComponent,
    ReactiveFormsModule, RouterLink, FormErrorLabel, LoaderComponent],
  templateUrl: './form-details.component.html',
})
export class FormDetails implements OnChanges {

  private fb = inject(FormBuilder);
  activatedRouter = inject(ActivatedRoute);
  personalService = inject(PersonalService);
  notificacionService = inject(NotificationService);
  loaderService = inject(LoaderService);
  router = inject(Router);
  @Input() titleForm: string = 'Nuevo Personal';


  @Input() optionsRoles: { value: any; label: string }[] = [];
  @Input() optionsDocumento: { value: any; label: string }[] = [];
  @Input() optionsServicios: ServicePersonal[] = [];

  formPersonal = this.fb.group({
    nombre: ['', Validators.required],
    rol: ['', Validators.required],
    tipoDocumento: ['', Validators.required],
    numeroDocumento: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.minLength(4), Validators.required]],
  });

  personalID = toSignal(
    this.activatedRouter.params.pipe(map((param) => param['id']))
  );

  personalResource = rxResource({
    stream: () => this.personalService.getUserById(this.personalID()!).pipe(
      tap((resp) => {
        if (resp.success) {
          this.setValuesForm(resp.data);
        }
        return resp;
      })
    )
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionsServicios'] && this.optionsServicios) {
      // Initialize servicios signal with optionsServicios
      this.servicios.set(this.optionsServicios);
    }

    // Update password validation based on whether creating or editing
    if (this.personalID() === 'new') {
      // Creating new personal: password is required
      this.formPersonal.controls.password.setValidators([Validators.required, Validators.minLength(4)]);
    } else {
      // Editing existing personal: password is optional
      this.formPersonal.controls.password.clearValidators();
      this.formPersonal.controls.password.setValidators([Validators.minLength(4)]);
    }
    this.formPersonal.controls.password.updateValueAndValidity();
  }

  setValuesForm(data: PersonalInterface) {
    // Don't set password when editing - leave it empty for security
    this.formPersonal.patchValue({
      nombre: data.full_name,
      rol: data.role_id.toString(),
      password: '', // Leave empty - only update if user enters new password
      tipoDocumento: data.type_document,
      numeroDocumento: data.number_document,
      phone: data.phone,
      email: data.email,
    });

    this.disponibilidad.set(
      data.availability?.map((day) => ({
        id: day.id ? parseInt(day.id) : 0,
        name: day.day_of_week,
        enabled: true,
        startTime: day.start_time,
        endTime: day.end_time
      }))
      || []);

    // Map services and mark as selected if they exist in the personal's services
    const selectedServices = this.optionsServicios.map((service) => {
      const isSelected = data.services?.some((s) => s.id === service.id);
      return {
        ...service,
        selected: isSelected || false
      };
    });

    this.servicios.set(selectedServices);

    console.log("Set disponibilidad: ", this.disponibilidad());
    console.log("Set servicios: ", this.servicios());

  }

  disponibilidad = signal<DayDisponiblidad[]>([]);
  servicios = signal<ServicePersonal[]>([]);

  onDisponibilidadChanged(availability: DayDisponiblidad[]) {
    this.disponibilidad.set(availability);
  }

  onServicioChange(service: ServicePersonal[]) {
    this.servicios.set(service);
  }

  onformChange(value: string, input: string) {
    if (input == 'rol') {
      this.formPersonal.controls.rol.setValue(value);
    }

    if (input == 'tipoDoc') {
      this.formPersonal.controls.tipoDocumento.setValue(value);
    }
  }

  eventPersonal = '';

  async onSubmit() {
    const valid = this.formPersonal.valid;
    this.formPersonal.markAllAsTouched();

    if (!valid) {
      this.notificacionService.error(
        "Formulario Invalido, Completar los campos requeridos",
        'Error',
        4000
      );
      return;
    }

    if (this.personalID() == 'new') {
      // Crear Personal
      const availabilitySet = this.disponibilidad().filter((day) => day.enabled).map((day) => {
        return {
          day_week_id: day.id,
          day_of_week: day.name,
          start_time: day.startTime,
          end_time: day.endTime
        };
      });

      const newPersonal: Partial<PersonalInterface> = {
        name_user: this.formPersonal.value.nombre!,
        last_name: this.formPersonal.value.nombre?.split(' ').slice(1).join(' ') || '',
        password: this.formPersonal.value.password!,
        phone: this.formPersonal.value.phone!,
        email: this.formPersonal.value.email!,
        role_id: parseInt(this.formPersonal.value.rol!),
        type_document: this.formPersonal.value.tipoDocumento!,
        number_document: this.formPersonal.value.numeroDocumento!,
        availability: availabilitySet,
        services: this.servicios().filter(s => s.selected),
      };
      this.loaderService.show();


      const personal = await firstValueFrom(this.personalService.agregarUser(newPersonal));
      this.loaderService.hide();
      if (personal.success) {
        this.notificacionService.success(
          "Personal creado con exito",
          'Exito',
          4000
        );
        this.router.navigateByUrl('/panel/personal');

      } else {
        this.notificacionService.error(
          `Error al crear el personal`,
          'Error',
          4000
        );
        console.log("Error: ", personal.error);
      }

    } else {
      // Editar Personal
      const availabilitySet = this.disponibilidad().filter((day) => day.enabled).map((day) => {
        return {
          day_week_id: day.id,
          day_of_week: day.name,
          start_time: day.startTime,
          end_time: day.endTime
        };
      });

      const newPersonal: Partial<PersonalInterface> = {
        name_user: this.formPersonal.value.nombre!,
        last_name: this.formPersonal.value.nombre?.split(' ').slice(1).join(' ') || '',
        phone: this.formPersonal.value.phone!,
        email: this.formPersonal.value.email!,
        role_id: parseInt(this.formPersonal.value.rol!),
        type_document: this.formPersonal.value.tipoDocumento!,
        number_document: this.formPersonal.value.numeroDocumento!,
        availability: availabilitySet,
        services: this.servicios().filter(s => s.selected),
      };

      // Only include password if user entered a new one
      if (this.formPersonal.value.password && this.formPersonal.value.password.trim() !== '') {
        newPersonal.password = this.formPersonal.value.password;
      }

      this.loaderService.show();

      const personal = await firstValueFrom(this.personalService.actualizarUser(this.personalID()!, newPersonal));
      this.loaderService.hide();
      if (personal.success) {
        this.notificacionService.success(
          "Personal actualizado con exito",
          'Exito',
          4000
        );
        this.router.navigateByUrl('/panel/personal');

      } else {
        this.notificacionService.error(
          `Error al actualizar el personal`,
          'Error',
          4000
        );
        console.log("Error: ", personal.error);
      } 

    }

    console.log("Value: ", this.formPersonal.value);
    console.log("disponibilidad: ", this.disponibilidad());
    console.log("servicios: ", this.servicios());
  }
}
