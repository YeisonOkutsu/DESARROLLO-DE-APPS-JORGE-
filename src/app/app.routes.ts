import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'gallery',
    pathMatch: 'full',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./gallery/gallery.page').then((m) => m.GalleryPage),
  },
];
