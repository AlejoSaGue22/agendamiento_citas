import { Component, inject, input, output } from '@angular/core';
import { CheckboxComponent } from "../../../../shared/components/form/input/checkbox.component";
import { AvatarTextComponent } from "../../../../shared/components/ui/avatar/avatar-text.component";
import { BadgeComponent } from "../../../../shared/components/ui/badge/badge.component";
import { optionAdd } from '../add-servicio-modal/add-servicio-modal.component';
import { ServicioInterface } from '../../interfaces/servicios-interface';

@Component({
  selector: 'app-table-listservicios',
  imports: [AvatarTextComponent, BadgeComponent],
  templateUrl: './table-listservicios.component.html',
})
export class TableListservicios { 
      
      serviciosList = input<ServicioInterface[]>([]);
      selectedRows: string[] = [];
      selectAll: boolean = false;
      openModal = output<boolean>();
      openModalDelete = output<boolean>();
      option = output<optionAdd>();
      servicioEdit = output<any>();

      handleSelectAll() {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
          this.selectedRows = this.serviciosList().map(row => row.id);
        } else {
          this.selectedRows = [];
        }
      }

      // handleRowSelect(id: string) {
      //   if (this.selectedRows.includes(id)) {
      //     this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
      //   } else {
      //     this.selectedRows = [...this.selectedRows, id];
      //   }
      // }

      modalOpen(option: optionAdd, servicio?: ServicioInterface){
          this.openModal.emit(true);
          if (option == 'add') {
            this.option.emit('add');
            return;
          }

          this.option.emit('edit'); 
          this.servicioEdit.emit(servicio);
      }

      modalDelete(servicio: ServicioInterface){
          this.openModalDelete.emit(true);
          this.servicioEdit.emit(servicio);
      }

      getBadgeColor(type: boolean): 'success' | 'warning' | 'error' {
        if (type === true) return 'success';
        if (type === false) return 'warning';
        return 'error';
      }
}
