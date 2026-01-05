import { AfterContentInit, Component, inject, signal, Input } from '@angular/core';
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


@Component({
  selector: 'app-form-details',
  imports: [SelectComponent, LabelComponent, DisponibilidadFormComponent, ServiciosFormComponent,
    ReactiveFormsModule, RouterLink, FormErrorLabel],
  templateUrl: './form-details.component.html',
})
export class FormDetails {

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
        tap((resp) =>{
          if (resp.success) {
            this.setValuesForm(resp.data);
          }
          return resp;
        })
      )
    });

    setValuesForm(data: PersonalInterface){
      // if (data) {
        this.formPersonal.patchValue({
            nombre: data.full_name,
            rol: data.role_id.toString(),
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
        // }
    }

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
            services: this.servicios(),
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
      }

        console.log("Value: ", this.formPersonal.value);
        console.log("disponibilidad: ", this.disponibilidad());
        console.log("servicios: ", this.servicios());
    }
 }
