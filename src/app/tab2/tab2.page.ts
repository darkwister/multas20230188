import { Component, OnInit } from '@angular/core';
import { MultaService } from '../services/multa.service';
import { Multa } from '../classes/multa';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonItemSliding, IonItemOptions, IonItemOption, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonIcon, IonButton, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonItemSliding, IonItemOptions, IonItemOption, CommonModule
]
})
export class Tab2Page implements OnInit {
  multas: Multa[] = [];
  private multasSubscription?: Subscription;

  constructor(private multaService: MultaService, private router: Router) {}
  // Cargar las multas cuando se inicie el componente
  ngOnInit() {
    this.multasSubscription = this.multaService.multas$.subscribe(multas => {
      this.multas = multas;
    });

    this.multaService.loadMultas();
  }
  // Limpiar la suscripción al destruir el componente
  ngOnDestroy() {
    if (this.multasSubscription) {
      this.multasSubscription.unsubscribe();
    }
  }
  // Navegar a la pantalla de detalles de la multa
  verDetalles(id: number) {
    this.router.navigate([`/detalle-multa/${id}`]);
  }
  // Eliminar una multa
  async eliminarMulta(id: number) {
    await this.multaService.eliminarMulta(id);
  }
  // Eliminar todas las multas existentes
  async eliminarTodo(){
    await this.multaService.eliminarTodo();
  }
}
