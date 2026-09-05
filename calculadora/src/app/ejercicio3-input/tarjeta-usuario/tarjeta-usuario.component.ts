import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-usuario.component.html',
  styleUrl: './tarjeta-usuario.component.css'
})
export class TarjetaUsuarioComponent {
  @Input() nombre: string = '';
  @Input() edad: number = 0;
}
