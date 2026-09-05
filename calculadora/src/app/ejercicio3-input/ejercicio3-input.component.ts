import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaUsuarioComponent } from './tarjeta-usuario/tarjeta-usuario.component';
import { UsuarioService } from '../ejercicio1-api/usuario.service';

interface UsuarioLocal {
  nombre: string;
  edad: number;
}

@Component({
  selector: 'app-ejercicio3-input',
  standalone: true,
  imports: [CommonModule, TarjetaUsuarioComponent],
  templateUrl: './ejercicio3-input.component.html',
  styleUrl: './ejercicio3-input.component.css'
})
export class Ejercicio3InputComponent implements OnInit {
  // Array fijo (enunciado base)
  usuariosFijos: UsuarioLocal[] = [
    { nombre: 'Laura', edad: 22 },
    { nombre: 'Pedro', edad: 30 },
    { nombre: 'Sofía', edad: 25 }
  ];

  // Reto extra: usuarios reales desde la API (con edad simulada)
  usuariosApi: UsuarioLocal[] = [];
  mostrarApi = false;
  cargandoApi = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {}

  cargarDesdeApi(): void {
    this.cargandoApi = true;
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuariosApi = data.map((u, i) => ({
          nombre: u.name,
          edad: 20 + ((i * 7) % 30)  // edad simulada ya que la API no la devuelve
        }));
        this.mostrarApi = true;
        this.cargandoApi = false;
      },
      error: () => { this.cargandoApi = false; }
    });
  }
}
