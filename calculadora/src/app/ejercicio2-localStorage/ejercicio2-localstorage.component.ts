import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ejercicio2-localstorage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejercicio2-localstorage.component.html',
  styleUrl: './ejercicio2-localstorage.component.css'
})
export class Ejercicio2LocalStorageComponent implements OnInit {
  tareas: string[] = [];
  nuevaTarea = '';

  ngOnInit(): void {
    const guardadas = localStorage.getItem('tareas');
    if (guardadas) {
      this.tareas = JSON.parse(guardadas);
    }
  }

  agregarTarea(): void {
    const tarea = this.nuevaTarea.trim();
    if (!tarea) return;
    this.tareas.push(tarea);
    this.nuevaTarea = '';
    this.guardarEnStorage();
  }

  eliminarTarea(index: number): void {
    this.tareas.splice(index, 1);
    this.guardarEnStorage();
  }

  borrarTodo(): void {
    this.tareas = [];
    localStorage.removeItem('tareas');
  }

  guardarEnStorage(): void {
    localStorage.setItem('tareas', JSON.stringify(this.tareas));
  }
}
