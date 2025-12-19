import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { FormDetails } from "../../components/form-details/form-details.component";

@Component({
  selector: 'app-form-personal',
  imports: [PageBreadcrumbComponent, FormDetails],
  templateUrl: './form-personal.component.html',
})
export class FormPersonal {

  optionsPersonal = [
    { value: 'marketing', label: 'Personal 1' },
    { value: 'template', label: 'Personal 2' },
    { value: 'development', label: 'Personal 3' },
  ];
  
  eventPersonal = '';
 }
