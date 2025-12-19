import { KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

import { Component, ViewChild } from '@angular/core';
import { EventInput, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SelectComponent } from '../../../../shared/components/form/select/select.component';


interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    horario: string;
  };
}

@Component({
  selector: 'app-agendacitas',
  imports: [
    FormsModule,
    KeyValuePipe,
    FullCalendarModule,
    ModalComponent,
    LabelComponent,
    SelectComponent
  ],
  templateUrl: './agendacitas.component.html',
})
export class AgendacitasComponent {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  eventServicio = '';
  eventPersonal = '';
  eventPuesto = '';
  eventStartDate = '';
  eventEndDate = '';
  eventCliente = '';
  eventHorarios = '';
  isOpen = false;
  optionsServicios = [
    { value: 'marketing', label: 'Servicio 1' },
    { value: 'template', label: 'Servicio 2' },
    { value: 'development', label: 'Servicio 3' },
  ];

  optionsPersonal = [
    { value: 'marketing', label: 'Personal 1' },
    { value: 'template', label: 'Personal 2' },
    { value: 'development', label: 'Personal 3' },
  ];

  optionsRecursos = [
    { value: 'marketing', label: 'Recurso 1' },
    { value: 'template', label: 'Recurso 2' },
    { value: 'development', label: 'Recurso 3' },
  ];
  

  timeDisponibles: string[] = [ '10:00 AM', '09:00 AM', '12:00 AM', '01:30 PM'];

  calendarsEvents: Record<string, string> = {
    Danger: 'danger',
    Success: 'success',
    Primary: 'primary',
    Warning: 'warning'
  };

  calendarOptions!: CalendarOptions;

  ngOnInit() {
    this.events = [
      {
        id: '1',
        title: 'Manicure.',
        start: new Date().toISOString().split('T')[0],
        extendedProps: { calendar: 'Danger', horario: '10:00' }
      },
      {
        id: '2',
        title: 'Pelo',
        start: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        extendedProps: { calendar: 'Success', horario: '10:00' }
      },
      {
        id: '3',
        title: 'Uñas pies',
        start: new Date(Date.now() + 172800000).toISOString().split('.')[0],
        end: new Date(Date.now() + 259200000).toISOString().split('.')[0],
        extendedProps: { calendar: 'Danger', horario: '10:00' }
      }
    ];

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'ES',
      eventBackgroundColor: 'red',
      slotLabelFormat: { hour: '2-digit', minute: '2-digit', meridiem: 'short', hour12: true },
      headerToolbar: {
        left: 'prev,next addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      events: this.events,
      select: (info) => this.handleDateSelect(info),
      eventClick: (info) => this.handleEventClick(info),
      customButtons: {
        addEventButton: {
          text: 'Agendar cita +',
          click: () => this.openModal()
        }
      },
      eventContent: (arg) => this.renderEventContent(arg)
    };
  }

  handleDateChange($event: any) {
      throw new Error('Method not implemented.');
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log("handleDateSelect: ", selectInfo);

    this.resetModalFields();
    this.eventStartDate = selectInfo.startStr;
    this.eventEndDate = selectInfo.endStr || selectInfo.startStr;
    this.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log("clickInfo: ", clickInfo);
    const event = clickInfo.event as any;
    this.selectedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: { calendar: event.extendedProps.calendar, horario: '' }
    };
    this.eventServicio = event.title;
    this.eventStartDate = event.startStr;
    this.eventEndDate = event.endStr || '';
    this.eventHorarios = event.extendedProps.calendar;
    this.openModal();
  }

  handleAddOrUpdateEvent() {
    if (this.selectedEvent) {
      if (!this.eventServicio || !this.eventStartDate || !this.eventHorarios) {
        return;
      }
      
      this.events = this.events.map(ev =>
        ev.id === this.selectedEvent!.id
          ? {
              ...ev,
              title: this.eventServicio,
              start: this.eventStartDate,
              end: this.eventEndDate,
              extendedProps: { calendar: this.eventHorarios, horario: ''}
            }
          : ev
      );
    } else {
      
      if (!this.eventServicio || !this.eventStartDate || !this.eventHorarios) {
        return;
      }

      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: this.eventServicio,
        start: this.eventStartDate,
        end: this.eventEndDate,
        allDay: true,
        extendedProps: { calendar: this.eventHorarios, horario: '' }
      };
      this.events = [...this.events, newEvent];
    }
    this.calendarOptions.events = this.events;
    this.closeModal();
    this.resetModalFields();
  }

  resetModalFields() {
    this.eventServicio = '';
    this.eventStartDate = '';
    this.eventEndDate = '';
    this.eventHorarios = '';
    this.selectedEvent = null;
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.resetModalFields();
  }

  renderEventContent(eventInfo: any) {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
    return {
      html: `
        <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
          <div class="fc-daygrid-event-dot"></div>
          <div class="fc-event-time text-black">${eventInfo.timeText || ''}</div>
          <div class="fc-event-title">${eventInfo.event.title}</div>
        </div>
      `
    };
  }
}
