import { Routes } from '@angular/router';

export const EDIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./card-editor/card-editor.component').then(m => m.CardEditor),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./card-editor/card-editor.component').then(m => m.CardEditor),
  },
];