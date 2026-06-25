import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cards',
        loadChildren: () =>
            import('./features/read/read.routes').then(m => m.READ_ROUTES),
    },
    {
        path: 'edit',
        loadChildren: () =>
            import('./features/edit/edit.routes').then(m => m.EDIT_ROUTES),
    },
    { path: '', redirectTo: 'cards', pathMatch: 'full' },
];
