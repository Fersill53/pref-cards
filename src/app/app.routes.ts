import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'specialties',
    loadComponent: () =>
      import('./features/home/specialty-list/specialty-list.component').then(m => m.SpecialtyList),
  },
  {
    path: 'specialty/:specialtyId/surgeons',
    loadComponent: () =>
      import('./features/home/surgeon-list/surgeon-list.component').then(m => m.SurgeonList),
  },
  {
    path: 'surgeon/:surgeonId/cards',
    loadComponent: () =>
      import('./features/read/card-list/card-list.component').then(m => m.CardListComponent),
  },
  {
    path: 'cards/:id',
    loadComponent: () =>
      import('./features/read/card-view/card-view.component').then(m => m.CardView),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./features/edit/card-editor/card-editor.component').then(m => m.CardEditor),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./features/edit/card-editor/card-editor.component').then(m => m.CardEditor),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'instrument-sets',
    loadComponent: () =>
      import('./features/instrument-sets/specialty-list/instrument-specialty-list.component').then(m => m.InstrumentSpecialtyList),
  },
  {
    path: 'instrument-sets/view/:id',
    loadComponent: () =>
      import('./features/instrument-sets/set-view/instrument-set-view.component').then(m => m.InstrumentSetView),
  },
  {
    path: 'instrument-sets/edit',
    loadComponent: () =>
      import('./features/instrument-sets/set-editor/instrument-set-editor.component').then(m => m.InstrumentSetEditor),
  },
  {
    path: 'instrument-sets/edit/:id',
    loadComponent: () =>
      import('./features/instrument-sets/set-editor/instrument-set-editor.component').then(m => m.InstrumentSetEditor),
  },
  {
    path: 'instrument-sets/:specialtyId',
    loadComponent: () =>
      import('./features/instrument-sets/set-list/instrument-set-list.component').then(m => m.InstrumentSetList),
  },
];