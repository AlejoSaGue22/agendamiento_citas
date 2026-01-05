import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, input, OnChanges, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DayDisponiblidad {
  id: number;
  name: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-disponibilidad-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad-form.component.html',
})
export class DisponibilidadFormComponent implements AfterContentInit, OnChanges {

  disponibilidadChange = output<DayDisponiblidad[]>();
  selectedDisponibilidad = input<DayDisponiblidad[]>();

  ngOnChanges() {
      const incoming = this.selectedDisponibilidad();

      if (incoming === undefined || incoming.length === 0) {
        this.emitDisponibilidad()
        return;
      }

      const incomingMap = new Map(
        incoming.map(day => [day.id, day])
      );

      if (this.selectedDisponibilidad() && this.selectedDisponibilidad()?.length) {
        this.daysOfWeek = this.daysOfWeek?.map(day => {
          const incomingDay = incomingMap.get(day.id);

          return incomingDay
            ? { ...day, ...incomingDay }
            : { ...day };
        }) || [];
      }
  }

  ngAfterContentInit(): void {
      this.emitDisponibilidad();
  }

  daysOfWeek: DayDisponiblidad[] = [
    { id: 1, name: 'Lunes', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 2, name: 'Martes', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 3, name: 'Miércoles', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 4, name: 'Jueves', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 5, name: 'Viernes', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 6, name: 'Sábado', enabled: false, startTime: '--:--', endTime: '--:--' },
    { id: 7, name: 'Domingo', enabled: false, startTime: '--:--', endTime: '--:--' }
  ];

  toggleDay(day: DayDisponiblidad) {
      day.enabled = !day.enabled;
      if (!day.enabled) {
        day.startTime = '--:--';
        day.endTime = '--:--';
      } else {
        day.startTime = '09:00';
        day.endTime = '17:00';
      }
      this.emitDisponibilidad();
  }

  inputHoraChange(){
    this.emitDisponibilidad()
  }

  private emitDisponibilidad() {
    this.disponibilidadChange.emit(this.daysOfWeek);
  }

  getDayStatus(day: DayDisponiblidad): string {
    return day.enabled ? 'Trabaja' : 'Descansa';
  }

  getDayStatusClass(day: DayDisponiblidad): string {
    return day.enabled 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  saveDisponiblidad() {
    console.log('Disponibilidad guardada:', this.daysOfWeek);
    // Aquí iría la lógica para guardar en tu API
  }

  resetForm() {
      
  } 
}
