import { Component } from '@angular/core';
import { IonContent, IonHeader, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.css'],
  imports: [IonContent, IonHeader, IonRefresher, IonRefresherContent, IonTitle, IonToolbar],
})
export class ExampleComponent {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      (event as any).target.complete();
    }, 2000);
  }
}