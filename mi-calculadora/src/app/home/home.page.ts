import { Component, OnInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonSelect, IonSelectOption,
  IonButton, IonList, IonLabel, IonBadge, IonNote
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Operacion {
  n1: number;
  n2: number;
  op: string;
  simbolo: string;
  resultado: number | string;
  esError: boolean;
  ts: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonInput, IonSelect, IonSelectOption,
    IonButton, IonList, IonLabel, IonBadge, IonNote,
    FormsModule, CommonModule
  ],
})
export class HomePage implements OnInit {
  num1: number | null = null;
  num2: number | null = null;
  op: string = 'multiplicar';
  resultado: number | string = '—';
  esError: boolean = false;
  historial: Operacion[] = [];

  readonly SYMBOLS: Record<string, string> = { sumar: '+', restar: '-', multiplicar: 'x', dividir: '/' };

  constructor() {}

  ngOnInit() {
    const guardado = localStorage.getItem('calc_historial_puro');
    if (guardado) {
      this.historial = JSON.parse(guardado);
    }
  }

  calcular() {
    if (this.num1 === null || this.num2 === null) {
      this.resultado = 'Ingresa ambos números';
      this.esError = true;
      return;
    }

    let res: number | string = 0;
    this.esError = false;

    switch (this.op) {
      case 'sumar': res = this.num1 + this.num2; break;
      case 'restar': res = this.num1 - this.num2; break;
      case 'multiplicar': res = this.num1 * this.num2; break;
      case 'dividir':
        if (this.num2 === 0) { res = 'División por cero'; this.esError = true; } 
        else { res = this.num1 / this.num2; }
        break;
    }

    if (!this.esError && typeof res === 'number') {
      res = Number.isInteger(res) ? res : parseFloat(res.toFixed(10));
    }

    this.resultado = res;

    const entrada: Operacion = {
      n1: this.num1, n2: this.num2, op: this.op,
      simbolo: this.SYMBOLS[this.op],
      resultado: this.resultado, esError: this.esError,
      ts: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    this.historial.unshift(entrada);
    if (this.historial.length > 50) this.historial.pop();
    localStorage.setItem('calc_historial_puro', JSON.stringify(this.historial));
  }

  limpiarHistorial() {
    this.historial = [];
    localStorage.removeItem('calc_historial_puro');
  }
}
