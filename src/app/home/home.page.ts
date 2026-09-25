import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, RouterLink],
})
export class HomePage {
  components = [
    { name: 'Accordion', route: '/component/accordion' },
    { name: 'Action Sheet', route: '/component/action-sheet' },
    { name: 'Alert', route: '/component/alert' },
    { name: 'Badge', route: '/component/badge' },
    { name: 'Breadcrumbs', route: '/component/breadcrumbs' },
    { name: 'Button', route: '/component/button' },
    { name: 'Card', route: '/component/card' },
    { name: 'Checkbox', route: '/component/checkbox' },
    { name: 'Chip', route: '/component/chip' },
    { name: 'DateTime', route: '/component/datetime' },
    { name: 'FAB', route: '/component/fab' },
    { name: 'Grid', route: '/component/grid' },
    { name: 'Icon', route: '/component/icon' },
    { name: 'Infinite Scroll', route: '/component/infinite-scroll' },
    { name: 'Input', route: '/component/input' },
    { name: 'List', route: '/component/list' },
    { name: 'Menu', route: '/component/menu' },
    { name: 'Modal', route: '/component/modal' },
    { name: 'Popover', route: '/component/popover' },
    { name: 'Progress Bar', route: '/component/progress-bar' },
    { name: 'Radio', route: '/component/radio' },
    { name: 'Range', route: '/component/range' },
    { name: 'Refresher', route: '/component/refresher' },
    { name: 'Reorder', route: '/component/reorder' },
    { name: 'Searchbar', route: '/component/searchbar' },
    { name: 'Segment', route: '/component/segment' },
    { name: 'Select', route: '/component/select' },
    { name: 'Toast', route: '/component/toast' },
    { name: 'Toggle', route: '/component/toggle' },
    { name: 'Toolbar', route: '/component/toolbar' },
    { name: 'Typography', route: '/component/typography' },
  ];
}
