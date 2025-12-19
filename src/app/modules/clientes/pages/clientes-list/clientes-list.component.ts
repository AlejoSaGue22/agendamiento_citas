import { Component, inject, signal } from '@angular/core';
import { PageBreadcrumbComponent } from "../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { TableListclientes } from "../../components/table-listclientes/table-listclientes.component";
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ClientesService } from '../../../../services/clientes.service';
import { FormErrorLabel } from "../../../../utils/components/form-error-label/form-error-label.component";
import { NotificationService } from '../../../../shared/services/notificacion.service';
import { firstValueFrom } from 'rxjs';
import { ClienteInterface } from '../../interfaces/clientes-interface';
import { LoaderService } from '../../../../shared/services/loader.service';
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { FormUtils } from '../../../../utils/form.utils';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-clientes-list',
  imports: [PageBreadcrumbComponent, TableListclientes, ModalComponent, ReactiveFormsModule,
    LabelComponent, TextAreaComponent, FormErrorLabel, ButtonComponent, LoaderComponent],
  templateUrl: './clientes-list.component.html',
})
export class ClientesListComponent {
      
  isOpen = signal<boolean>(false);
  openModalDelete = signal<boolean>(false);
  optionModal = signal<optionAdd>('add');
  clienteInfo = signal<ClienteInterface | null>(null);
  private fb = inject(FormBuilder);
  clientesService = inject(ClientesService);
  notificationService = inject(NotificationService);
  loaderService = inject(LoaderService);

  formClientes = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
      notas: ['']
  });

  clientesResource = rxResource({
      stream: () =>
      this.clientesService.getClientes({
          offset: 0,
          limit: 10
      })
  });

  setModal(cliente: ClienteInterface){
    this.clienteInfo.set(cliente);
      this.formClientes.patchValue({
          nombre: cliente.name_client,
          apellido: cliente.last_name,
          notas: cliente.notes,
          email: cliente.email,
          telefono: cliente.phone
      })
  }

  onformChange(value: string) {
    this.formClientes.patchValue({ notas: value })
  }

  resetModalFields(){

  }

  async onSubmit(){
    const valid = this.formClientes.valid;
    this.formClientes.markAllAsTouched();

    if(!valid) {
        this.notificationService.error(
                "Formulario Invalido",
                'Error',
                4000
        ); 
        return;
    };


    const formValue = this.formClientes.value;
    const idClients = this.clienteInfo()?.id;

    console.log("ID cliente: ",idClients)
    console.log("cliente: ",this.clienteInfo())

    this.loaderService.show();

    if (this.optionModal() == 'add') {
              const cliente = await firstValueFrom(this.clientesService.agregarCliente(formValue as Partial<ClienteInterface>));
              if (cliente.success == false) {
                  this.notificationService.error(
                    `Hubo un error al guardar el servicio ${cliente.error.message}`,
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

    }else{
        if (!idClients) {
            this.notificationService.error(
                "Error en obtener el Id del Cliente",
                'Error',
                4000
            ); 
            return;
        }

        const clientsUpdate = await firstValueFrom(this.clientesService.actualizarCliente(idClients, formValue as Partial<ClienteInterface>));
        if (clientsUpdate.success == false) {
            this.notificationService.error(
                `Hubo un error al guardar el servicio ${clientsUpdate.error.message}`,
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

    }
    this.loaderService.hide();
    this.closeModal()
    this.clientesResource.reload(); 
  }


  async deleteClient(){
        const id = this.clienteInfo()?.id;
        if (!id) return;

        const deleteClient = await firstValueFrom(this.clientesService.deleteCliente(id));
        if (deleteClient.success == false) {
              this.notificationService.error(
                `Hubo un error al eliminar el cliente ${deleteClient.error.message}`,
                'Error',
                4000
              );    
              return;
          }
          
          this.notificationService.success(
                'Accion Realizada',
                `Se elimino exitosamente el cliente`,
                4000
          )
          this.closeModal();
          this.clientesResource.reload();
    }

  openModal(open: boolean){
    this.formClientes.reset();
    if (this.optionModal() == 'edit') {
      this.setModal(this.clienteInfo()!);
    }

    this.isOpen.set(open);
  }

  closeModal(){
    this.isOpen.set(false);
    this.openModalDelete.set(false);
    this.resetModalFields();
  }
}
