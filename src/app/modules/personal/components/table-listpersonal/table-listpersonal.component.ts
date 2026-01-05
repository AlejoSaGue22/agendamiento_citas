import { Component, input, output } from '@angular/core';

import { RouterLink } from "@angular/router";
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../../shared/components/form/input/checkbox.component';
import { PersonalInterface } from '../../interfaces/personal-interface';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';

@Component({
  selector: 'app-table-listpersonal',
  imports: [BadgeComponent, AvatarTextComponent, RouterLink],
  templateUrl: './table-listpersonal.component.html',
})
export class TableListpersonal {

  personalList = input<PersonalInterface[]>([]);
  selectedRows: string[] = [];
  selectAll: boolean = false;
  option = output<optionAdd>();
  openModalDelete = output<boolean>();
  personalEdit = output<PersonalInterface>();



  handleSelectAll() {
      this.selectAll = !this.selectAll;
      if (this.selectAll) {
        this.selectedRows = this.personalList().map(row => row.id);
      } else {
        this.selectedRows = [];
      }
  }

  // handleRowSelect(id: string) {
  //     if (this.selectedRows.includes(id)) {
  //       this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
  //     } else {
  //       this.selectedRows = [...this.selectedRows, id];
  //     }
  // }

  modalDelete(servicio: PersonalInterface){
              this.openModalDelete.emit(true);
              this.personalEdit.emit(servicio);
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
      if (type === 'Complete') return 'success';
      if (type === 'Pending') return 'warning';
      return 'error';
  }

 }
