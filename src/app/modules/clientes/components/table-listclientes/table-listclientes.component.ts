import { Component, output } from '@angular/core';
import { optionAdd } from '../../../servicios/components/add-servicio-modal/add-servicio-modal.component';
import { BadgeComponent } from "../../../../shared/components/ui/badge/badge.component";
import { AvatarTextComponent } from "../../../../shared/components/ui/avatar/avatar-text.component";

@Component({
  selector: 'app-table-listclientes',
  imports: [BadgeComponent, AvatarTextComponent],
  templateUrl: './table-listclientes.component.html',
})
export class TableListclientes {
      selectedRows: string[] = [];
      selectAll: boolean = false;
      openModal = output<boolean>();
      option = output<optionAdd>();
      clienteEdit = output<any>();

      tableRowData = [
        {
          id: 'DE124321',
          user: { initials: 'AB', name: 'John Doe', email: 'johndoe@gmail.com' },
          avatarColor: 'brand',
          product: { name: 'Software License', price: '$18,50.34', purchaseDate: '2024-06-15' },
          status: { type: 'Complete' },
          actions: { delete: true },
        },
        {
          id: 'DE124322',
          user: { initials: 'CD', name: 'Jane Smith', email: 'janesmith@gmail.com' },
          avatarColor: 'brand',
          product: { name: 'Cloud Hosting', price: '$12,99.00', purchaseDate: '2024-06-18' },
          status: { type: 'Pending' },
          actions: { delete: true },
        },
        {
          id: 'DE124323',
          user: { initials: 'EF', name: 'Michael Brown', email: 'michaelbrown@gmail.com' },
          avatarColor: 'brand',
          product: { name: 'Web Domain', price: '$9,50.00', purchaseDate: '2024-06-20' },
          status: { type: 'Cancel' },
          actions: { delete: true },
        },
        {
          id: 'DE124324',
          user: { initials: 'GH', name: 'Alice Johnson', email: 'alicejohnson@gmail.com' },
          avatarColor: 'brand',
          product: { name: 'SSL Certificate', price: '$2,30.45', purchaseDate: '2024-06-25' },
          status: { type: 'Pending' },
          actions: { delete: true },
        },
        {
          id: 'DE124325',
          user: { initials: 'IJ', name: 'Robert Lee', email: 'robertlee@gmail.com' },
          avatarColor: 'brand',
          product: { name: 'Premium Support', price: '$15,20.00', purchaseDate: '2024-06-30' },
          status: { type: 'Complete' },
          actions: { delete: true },
        },
      ];

      handleSelectAll() {
          this.selectAll = !this.selectAll;
          if (this.selectAll) {
            this.selectedRows = this.tableRowData.map(row => row.id);
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
