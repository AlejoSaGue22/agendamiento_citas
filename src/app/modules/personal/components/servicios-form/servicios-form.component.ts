import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicePersonal } from '../../interfaces/personal-interface';

@Component({
  selector: 'app-servicios-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-form.component.html',
})
export class ServiciosFormComponent implements AfterContentInit {

  servicioPersonal = output<ServicePersonal[]>();
  @Input() serviciosDisponiblesInput?: ServicePersonal[];
  serviciosDisponibles: ServicePersonal[] = [];

  ngAfterContentInit(): void {
    if (this.serviciosDisponiblesInput && this.serviciosDisponiblesInput.length) {
      this.serviciosDisponibles = this.serviciosDisponiblesInput.map(s => ({ ...s, selected: !!s.selected }));
    }
    this.emitService();
  }

  toggleService(service: ServicePersonal) {
    service.selected = !service.selected;
    this.emitService()
  }

  private emitService() {
    // Emit all services with their current selection state, not just selected ones
    this.servicioPersonal.emit(this.serviciosDisponiblesInput || []);
  }

  getSelectedServices(): ServicePersonal[] {
    return this.serviciosDisponiblesInput?.filter(service => service.selected) || [];
  }

}
