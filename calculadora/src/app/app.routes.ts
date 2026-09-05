import { Routes } from '@angular/router';
import { Ejercicio1ApiComponent } from './ejercicio1-api/ejercicio1-api.component';
import { Ejercicio2LocalStorageComponent } from './ejercicio2-localStorage/ejercicio2-localstorage.component';
import { Ejercicio3InputComponent } from './ejercicio3-input/ejercicio3-input.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ejercicio1', pathMatch: 'full' },
  { path: 'ejercicio1', component: Ejercicio1ApiComponent },
  { path: 'ejercicio2', component: Ejercicio2LocalStorageComponent },
  { path: 'ejercicio3', component: Ejercicio3InputComponent },
];
