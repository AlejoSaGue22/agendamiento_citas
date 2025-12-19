import { Component, inject, signal } from '@angular/core';
import { PageBreadcrumbComponent } from "../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { TableListclientes } from "../../components/table-listclientes/table-listclientes.component";
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";

@Component({
  selector: 'app-clientes-list',
  imports: [PageBreadcrumbComponent, TableListclientes, ModalComponent, ReactiveFormsModule, LabelComponent, TextAreaComponent],
  templateUrl: './clientes-list.component.html',
})
export class ClientesListComponent {
      
  selectedEvent: boolean = true;
  isOpen = signal<boolean>(false);
  optionModal = signal<optionAdd>('add');
  clienteInfo = signal<any>({});
  private fb = inject(FormBuilder);

  formClientes = this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      email: [''],
      notas: ['']
  });

  setModal(cliente: any){
    this.formClientes.patchValue({
      nombre: cliente.user.name,
      email: cliente.user.email,
      telefono: '30000'
    });
  }

  onformChange() {
    throw new Error('Method not implemented.');
  }

  resetModalFields(){

  }

  onSubmit(){

  }

  openModal(open: boolean){
    console.log("Abrir modal: ", this.optionModal());
    console.log("Cliente modal: ", this.clienteInfo());
    if (this.optionModal() == 'edit') {
      this.setModal(this.clienteInfo());
    }
    this.isOpen.set(open);
  }

  closeModal(){
    this.isOpen.set(false);
    this.resetModalFields();
  }
}
