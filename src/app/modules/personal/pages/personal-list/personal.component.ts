import { Component } from '@angular/core';
import { TableListpersonal } from '../../components/table-listpersonal/table-listpersonal.component';
import { PageBreadcrumbComponent } from '../../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-personal-component',
  imports: [PageBreadcrumbComponent, TableListpersonal],
  templateUrl: './personal.component.html',
})
export class PersonalComponent { }
