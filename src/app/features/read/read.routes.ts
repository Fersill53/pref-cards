import { Routes } from '@angular/router';

export const READ_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./card-list/card-list.component').then(m => m.CardListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./card-view/card-view.component').then(m => m.CardView),
  },
];