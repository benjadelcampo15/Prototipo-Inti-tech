import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/authguard.guard';
import { CargaComponent } from './components/carga/carga.component';
import { HistorialComponent } from './components/historial/historial.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'inicio/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'carga',
        component: CargaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'historial',
        component: HistorialComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
