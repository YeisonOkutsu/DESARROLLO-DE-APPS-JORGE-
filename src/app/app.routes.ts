import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'component/accordion',
    loadComponent: () => import('./components/accordion/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/action-sheet',
    loadComponent: () => import('./components/action-sheet/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/alert',
    loadComponent: () => import('./components/alert/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/badge',
    loadComponent: () => import('./components/badge/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/breadcrumbs',
    loadComponent: () => import('./components/breadcrumbs/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/button',
    loadComponent: () => import('./components/button/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/card',
    loadComponent: () => import('./components/card/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/checkbox',
    loadComponent: () => import('./components/checkbox/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/chip',
    loadComponent: () => import('./components/chip/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/datetime',
    loadComponent: () => import('./components/datetime/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/fab',
    loadComponent: () => import('./components/fab/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/grid',
    loadComponent: () => import('./components/grid/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/icon',
    loadComponent: () => import('./components/icon/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/infinite-scroll',
    loadComponent: () => import('./components/infinite-scroll/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/input',
    loadComponent: () => import('./components/input/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/list',
    loadComponent: () => import('./components/list/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/menu',
    loadComponent: () => import('./components/menu/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/modal',
    loadComponent: () => import('./components/modal/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/popover',
    loadComponent: () => import('./components/popover/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/progress-bar',
    loadComponent: () => import('./components/progress-bar/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/radio',
    loadComponent: () => import('./components/radio/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/range',
    loadComponent: () => import('./components/range/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/refresher',
    loadComponent: () => import('./components/refresher/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/reorder',
    loadComponent: () => import('./components/reorder/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/searchbar',
    loadComponent: () => import('./components/searchbar/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/segment',
    loadComponent: () => import('./components/segment/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/select',
    loadComponent: () => import('./components/select/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/toast',
    loadComponent: () => import('./components/toast/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/toggle',
    loadComponent: () => import('./components/toggle/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/toolbar',
    loadComponent: () => import('./components/toolbar/example.component').then(m => m.ExampleComponent),
  },
  {
    path: 'component/typography',
    loadComponent: () => import('./components/typography/example.component').then(m => m.ExampleComponent),
  },
];
