import { Component } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.css'],
  imports: [IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonTitle, IonToolbar],
})
export class ExampleComponent {
  constructor() {
    addIcons({ add });
  }
}