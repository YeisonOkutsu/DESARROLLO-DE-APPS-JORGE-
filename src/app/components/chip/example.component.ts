import { Component } from '@angular/core';
import { IonChip, IonLabel } from '@ionic/angular';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.css'],
  imports: [IonChip, IonLabel],
})
export class ExampleComponent {}