import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { PageBreadcrumbComponent } from "../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { TableListservicios } from "../../components/table-listservicios/table-listservicios.component";
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { AddServicioModal, optionAdd } from "../../components/add-servicio-modal/add-servicio-modal.component";
import { ServicesService } from '../../../../services/services.service';
import { ServicioInterface } from '../../interfaces/servicios-interface';
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notificacion.service';

@Component({
  selector: 'app-servicios-list',
  imports: [PageBreadcrumbComponent, TableListservicios, ModalComponent, AddServicioModal, ButtonComponent],
  templateUrl: './servicios-list.component.html',
})
export class ServiciosList {

      servicioService = inject(ServicesService);
      notificationService = inject(NotificationService);
      openModalServicios = signal<boolean>(false);
      openModalDelete = signal<boolean>(false);
      optionModal = signal<optionAdd>('add');
      servicioInfo = signal<ServicioInterface | null>(null);

      servicioResource = rxResource({
        
        stream: () =>
          this.servicioService.getServices({
            offset: 0,
            limit: 10
          }).pipe(
            // tap((el) => {
            //   this.totalCliente.set(el.count);
            //   this.cardsTotales.set([
            //     { title: 'Total Clientes', valor: this.totalCliente().toString(), percent: '0' },
            //     { title: 'Nuevos este Mes', valor: '0', percent: '0' },
            //   ]);
            // })
        )
      });
      
      resetModalFields() {
        // this.openOutput
      }

      async deleteService(){
        const id = this.servicioInfo()?.id;
        if (!id) return;

        const deleteService = await firstValueFrom(this.servicioService.deleteService(id));
        if (deleteService.success == false) {
              this.notificationService.error(
                `Hubo un error al eliminar el servicio ${deleteService.error.message}`,
                'Error',
                4000
              );    
              return;
          }
          
          this.notificationService.success(
                'Accion Realizada',
                `Se elimino exitosamente el servicio`,
                4000
          )
          this.closeModal();
          this.onServiceSaved();
      }

      onServiceSaved(){
        this.closeModal();
        this.servicioResource.reload();
      }
      
      closeModal() {
        this.openModalServicios.set(false);
        this.openModalDelete.set(false);
        this.resetModalFields();
      }
 }

