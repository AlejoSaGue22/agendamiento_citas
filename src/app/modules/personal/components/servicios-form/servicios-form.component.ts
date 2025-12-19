import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ServicePersonal {
  id: number;
  name: string;
  duration: number; // en minutos
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-servicios-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-form.component.html',
})
export class ServiciosFormComponent implements AfterContentInit {

  servicioPersonal = output<ServicePersonal[]>();

  ngAfterContentInit(): void {
      this.emitService();
  }

  serviciosDisponibles: ServicePersonal[] = [
    { id: 1, name: 'Corte de cabello', duration: 30, price: 150, selected: false },
    { id: 2, name: 'Coloración', duration: 120, price: 500, selected: false },
    { id: 3, name: 'Manicure', duration: 45, price: 100, selected: false },
    { id: 4, name: 'Pedicure', duration: 60, price: 120, selected: false },
    { id: 5, name: 'Masaje facial', duration: 30, price: 200, selected: false },
    { id: 6, name: 'Depilación', duration: 45, price: 180, selected: false },
  ];

  toggleService(service: ServicePersonal) {
    service.selected = !service.selected;
    this.emitService()
  }

  private emitService(){
    this.servicioPersonal.emit(this.serviciosDisponibles);
  }

  getSelectedServices(): ServicePersonal[] {
    return this.serviciosDisponibles.filter(service => service.selected);
  }

}
