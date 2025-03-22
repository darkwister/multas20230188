import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCardContent, IonImg, IonCard, IonAvatar, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonAvatar, IonCard, IonImg, IonCardContent, IonList, IonHeader, IonToolbar, IonTitle, IonContent ],
})
export class Tab3Page {
  constructor() {}
}
