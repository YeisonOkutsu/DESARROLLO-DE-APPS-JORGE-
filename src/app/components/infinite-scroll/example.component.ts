import { Component } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.css'],
  imports: [IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList],
})
export class ExampleComponent {
  items: string[] = [];

  constructor() {
    this.generateItems();
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      ev.target.complete();
    }, 500);
  }
}