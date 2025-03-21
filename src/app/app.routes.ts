import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'detalle-multa/:id',
    loadComponent: () => import('./detalle-multa/detalle-multa.page').then( m => m.DetalleMultaPage)
  },
];
