import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.interface';

@Component({
  selector: 'app-ejercicio1-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ejercicio1-api.component.html',
  styleUrl: './ejercicio1-api.component.css'
})
export class Ejercicio1ApiComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.message;
        this.cargando = false;
      }
    });
  }
}
