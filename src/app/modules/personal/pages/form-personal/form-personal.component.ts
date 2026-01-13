import { Component, OnInit, inject, signal } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { FormDetails } from "../../components/form-details/form-details.component";
import { ServicesService } from '../../../../services/services.service';
import { CatalogService } from '../../../../services/catalog.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Roles, TypeDocument } from '../../../../auth/interfaces/user.interface';
import { ServicioResponse } from '../../../servicios/interfaces/servicios-interface';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-form-personal',
  imports: [PageBreadcrumbComponent, FormDetails, LoaderComponent],
  templateUrl: './form-personal.component.html',
})
export class FormPersonal implements OnInit {

  private servicesService = inject(ServicesService);
  private catalogService = inject(CatalogService);

  optionsDocumento: { value: any; label: string }[] = [];
  optionsRoles: { value: any; label: string }[] = [];
  isLoading = signal<number>(0);
  optionsServicios: { id: number; name: string; duration: number; price: number; selected: boolean }[] = [];

  ngOnInit(): void {
    
    // Document types
    this.catalogService.getDocumentTypes().pipe(
      catchError(() => of([]))
    ).subscribe((list: TypeDocument[]) => {
      this.optionsDocumento = list.map(item => ({ value: item.abbreviation ?? item.name, label: item.name }));
      this.isLoading.set(1);
    });

    // Roles
    this.catalogService.getRoles().pipe(
      catchError(() => of([]))
    ).subscribe((list: Roles[]) => {
      this.optionsRoles = list.map(item => ({ value: item.id ?? item.name, label: item.name }));
      this.isLoading.set(2);
    });

    // Services
    this.servicesService.getServices({ limit: 100, offset: 0 }).pipe(
      catchError(() => of({ servicios: [] })),
      map((resp) => resp.servicios || [])
    ).subscribe((servicios) => {
      this.optionsServicios = servicios.map(s => ({ id: Number(s.id), name: s.name, duration: Number(s.duration_minutes || 0),
                                                   price: Number(s.price || 0), selected: false }));
      this.isLoading.set(3);
    });
  }
}

