import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DayDisponiblidad {
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
export class DisponibilidadFormComponent implements AfterContentInit {

  disponibilidadChange = output<DayDisponiblidad[]>();

  ngAfterContentInit(): void {
      this.emitDisponibilidad();
  }

  daysOfWeek: DayDisponiblidad[] = [
    { name: 'Lunes', enabled: true, startTime: '09:00', endTime: '17:00' },
    { name: 'Martes', enabled: true, startTime: '09:00', endTime: '17:00' },
    { name: 'Miércoles', enabled: true, startTime: '09:00', endTime: '17:00' },
    { name: 'Jueves', enabled: true, startTime: '09:00', endTime: '17:00' },
    { name: 'Viernes', enabled: true, startTime: '09:00', endTime: '17:00' },
    { name: 'Sábado', enabled: false, startTime: '--:--', endTime: '--:--' },
    { name: 'Domingo', enabled: false, startTime: '--:--', endTime: '--:--' }
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
