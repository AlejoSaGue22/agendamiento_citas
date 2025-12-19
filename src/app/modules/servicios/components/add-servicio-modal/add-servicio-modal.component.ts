import { AfterContentInit, Component, effect, inject, input, linkedSignal, OnInit, output, signal } from '@angular/core';
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioInterface } from '../../interfaces/servicios-interface';
import { ServicesService } from '../../../../services/services.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notificacion.service';

export type optionAdd = 'add' | 'edit' | 'delete';

@Component({
  selector: 'app-add-servicio-modal',
  imports: [LabelComponent, TextAreaComponent, ReactiveFormsModule],
  templateUrl: './add-servicio-modal.component.html',
})
export class AddServicioModal implements AfterContentInit {

    option = input<optionAdd>();
    serviceSaved = output<boolean>();
    dataServicio = input<ServicioInterface>();
    serviceServicios = inject(ServicesService);
    notificationService = inject(NotificationService);
    router = inject(Router);
    
    private fb = inject(FormBuilder);

    formServicios = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      duration_minutes: ['', Validators.required],
      price: ['']
    })

    ngAfterContentInit(): void {
      this.formServicios.reset();

      if (this.option() == 'edit') {
          this.formServicios.patchValue({
            name: this.dataServicio()?.name,
            description: this.dataServicio()?.description,
            duration_minutes: this.dataServicio()?.duration_minutes,
            price: this.dataServicio()?.price
          })
      }
    }

    async onSubmit(){
      const valid = this.formServicios.valid;
      this.formServicios.markAllAsTouched();

      if(!valid) {
        this.notificationService.error(
                "Formulario Invalido",
                'Error',
                4000
              ); 
        return
      };

      const formValue = this.formServicios.value;
      const idService = this.dataServicio()?.id;

      if (this.option() == 'add') {
          const service = await firstValueFrom(this.serviceServicios.agregarService(formValue as Partial<ServicioInterface>));
          if (service.success == false) {
              this.notificationService.error(
                `Hubo un error al guardar el servicio ${service.error.message}`,
                'Error',
                4000
              ); 
              return;
          }
          
          this.notificationService.success(
                'Accion Realizada',
                `Se agrego exitosamente el servicio`,
                4000
          );
          this.serviceSaved.emit(true);
      }else{
          if (!idService) {
              this.notificationService.error(
                  "Error en obtener el Id Servicio",
                  'Error',
                  4000
              ); 
              return;
          }

          const serviceUpdate = await firstValueFrom(this.serviceServicios.actualizarService(idService, formValue as Partial<ServicioInterface>));
          if (serviceUpdate.success == false) {
              this.notificationService.error(
                  `Hubo un error al guardar el servicio ${serviceUpdate.error.message}`,
                  'Error',
                  4000
              ); 
              return;
          }
          
          this.notificationService.success(
                'Accion Realizada',
                `Se actualizó exitosamente el servicio`,
                4000
          );
          this.serviceSaved.emit(true);
      }

      await this.router.navigateByUrl('/panel/services');
      
    }

    onformChange(value: string){
        this.formServicios.patchValue({
          description: value
        })
    }

    // resetModalFields() {
    //   this.formServicios.reset();
    // }

    // closeModal() {
    //   this.resetModalFields();
    // }
 }
