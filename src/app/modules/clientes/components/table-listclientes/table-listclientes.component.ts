import { Component, input, output } from '@angular/core';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';
import { BadgeComponent } from "../../../../shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "../../../../shared/components/ui/avatar/avatar-text.component";
import { ClienteInterface } from '../../interfaces/clientes-interface';

@Component({
  selector: 'app-table-listclientes',
  imports: [BadgeComponent, AvatarTextComponent],
  templateUrl: './table-listclientes.component.html',
})
export class TableListclientes {

      clientesList = input<ClienteInterface[]>([]);
      selectedRows: string[] = [];
      selectAll: boolean = false;
      openModal = output<boolean>();
      option = output<optionAdd>();
      clienteEdit = output<any>();

      handleSelectAll() {
          this.selectAll = !this.selectAll;
          if (this.selectAll) {
            this.selectedRows = this.clientesList().map(row => row.id);
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

      modalOpen(option: optionAdd, cliente?: any){
          this.openModal.emit(true);
          if (option == 'add') {
              this.option.emit('add');
              return;
          }

          this.option.emit('edit');
          console.log(cliente);
          this.clienteEdit.emit(cliente);
      }

      getBadgeColor(type: string): 'success' | 'warning' | 'error' {
            if (type === 'Complete') return 'success';
            if (type === 'Pending') return 'warning';
            return 'error';
      }
}
