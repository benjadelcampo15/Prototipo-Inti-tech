import { Routes } from '@angular/router';
import { InicioComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'Inicio',
    component: InicioComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
