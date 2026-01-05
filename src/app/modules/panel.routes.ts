import { Routes } from "@angular/router";
import { AppLayoutComponent } from "../shared/layout/app-layout/app-layout.component";
import { EcommerceComponent } from "../pages/dashboard/ecommerce/ecommerce.component";
import { AgendacitasComponent } from "./citas/pages/agendacitas/agendacitas.component";
import { PersonalComponent } from "./personal/pages/personal-list/personal.component";
import { FormPersonal } from "./personal/pages/form-personal/form-personal.component";
import { ServiciosList } from "./servicios/pages/servicios-list/servicios-list.component";
import { ClientesListComponent } from "./clientes/pages/clientes-list/clientes-list.component";
import { ProfileComponent } from "../pages/profile/profile.component";
import { BlankComponent } from "../pages/blank/blank.component";
import { InvoicesComponent } from "../pages/invoices/invoices.component";
import { NotFoundComponent } from "../pages/other-page/not-found/not-found.component";

export const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
              {
                path: '',
                component: EcommerceComponent,
                pathMatch: 'full',
                title: 'Admin Panel - Inicio',
              },
              {
                path: 'appointments',
                component: AgendacitasComponent,
                title: 'AdminPanel - Agendamiento',
              },
              {
                path: 'personal',
                title: 'AdminPanel - Personal',
                children: [
                      {
                        path: '',
                        component: PersonalComponent
                      },
                      {
                        path: ':id',
                        component: FormPersonal
                      },
                      {
                        path: '**',
                        redirectTo: 'personal'
                      }
                ]
              },
              {
                path: 'services',
                component: ServiciosList,
                title: 'AdminPanel - Servicios',
              },
              {
                path:'clientes',
                component: ClientesListComponent,
                title:'AdminPanel - Clientes'
              },
              {
                path:'profile',
                component: ProfileComponent,
                title:'Angular Profile Dashboard | TailAdmin'
              },    
              {
                path:'blank',
                component:BlankComponent,
                title:'Blank | TailAdmin'
              },
              // support tickets
              {
                path:'invoice',
                component:InvoicesComponent,
                title:'Details Dashboard | TailAdmin'
              },
              {
                path:'**',
                component: NotFoundComponent,
                title:'NotFound Pages'
              },
        ],
    }
]

export default routes;