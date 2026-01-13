import { Component, inject, signal } from '@angular/core';
import { TableListpersonal } from '../../components/table-listpersonal/table-listpersonal.component';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { PersonalService } from '../../../../services/personal.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { PersonalInterface } from '../../interfaces/personal-interface';
import { NotificationService } from '../../../../shared/services/notificacion.service';

@Component({
  selector: 'app-personal-component',
  imports: [PageBreadcrumbComponent, TableListpersonal, ModalComponent, ButtonComponent],
  templateUrl: './personal.component.html',
})
export class PersonalComponent {

  personalService = inject(PersonalService);
  optionModal = signal<optionAdd>('add');
  openModalDelete = signal<boolean>(false);
  personalInfo = signal<PersonalInterface | null>(null);
  notificationService = inject(NotificationService);  


  usersResource = rxResource({
      stream: () =>
      this.personalService.getUsers({
          offset: 0,
          limit: 10
      })
  });


  openModal(open: boolean){
    this.openModalDelete.set(open);
  }

  closeModal(){
    this.openModalDelete.set(false);
  }

  deleteUser(){
      if (!this.personalInfo()) return;

      this.personalService.deleteUser(this.personalInfo()!.id).subscribe({
          next: (resp) => {
              if (resp.success) {
                  this.usersResource.reload();
                  this.closeModal();
                  this.notificationService.success(
                    "Personal eliminado con exito",
                    'Exito',
                    4000
                  );
              } else {
                this.notificationService.error(
                  "Error al eliminar el personal",
                  'Error',
                  4000
                );
              }
          },
          error: (err) => {
            this.notificationService.error(
              "Error al eliminar el personal",
              'Error',
              4000
            );
          }
      });
  }


 }
