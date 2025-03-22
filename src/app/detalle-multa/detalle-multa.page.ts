import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonText, IonButton, IonButtons, IonBackButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Multa } from '../classes/multa';
import { ActivatedRoute } from '@angular/router';
import { MultaService } from '../services/multa.service';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import L from 'leaflet';

@Component({
  selector: 'app-detalle-multa',
  templateUrl: './detalle-multa.page.html',
  styleUrls: ['./detalle-multa.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonBackButton, IonButtons, IonButton, IonText, IonImg, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCardSubtitle, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetalleMultaPage implements OnInit {

  multa?: Multa;
  public map!: L.Map;

  constructor(private multaService: MultaService, private router: ActivatedRoute) { }
  //Recibe como parametro el id de la multa a mostrar los detalles
  async ngOnInit() {
    if (!this.multa) {
      const id = this.router.snapshot.paramMap.get('id');
      if (id) {
        this.multa = await this.multaService.obtenerMultaPorId(parseInt(id));
        console.log(this.multa);
        this.loadMap();
      }
    }
  }
  // metodo para cargar el mapa en el tamaño de la pantalla
  ngAfterViewInit() {
    this.loadMap();
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 0); 
  }
  // Metodo para cargar el mapa con la ubicacion de la multa
  loadMap() {
    if (!this.multa?.ubicacion) return;
  
    const [lat, lng] = this.multa.ubicacion.split(',').map(Number);
  
    // Verificar si la instancia del mapa ya existe, si no, crearla
    if (!this.map) {
      this.map = L.map('map').setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    } else {
    // Si el mapa ya existe, solo actualizamos la vista
      this.map.setView([lat, lng], 15);
    } 
    const customIcon = L.icon({
            iconUrl: 'assets/marker-icon.png', 
            shadowUrl: 'assets/marker-shadow.png', 
            iconSize: [25, 41],
            iconAnchor: [12, 41], 
            popupAnchor: [1, -34], 
            shadowSize: [41, 41] 
          });
    L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
      .bindPopup('Ubicación de la multa')
      .openPopup();
  
    // Asegurar que el mapa se redibuje correctamente
    this.map.invalidateSize();
  }
  // Método para reproducir el audio
  reproducirAudio(audioBase64: string) {
    const audio = new Audio();
    // Establecer la fuente del audio en base64, esto permite reproducir el audio sin la necesidad de un servidor
    audio.src = audioBase64;
    // Reproducir el audio
    audio.play().catch((error) => {
      console.error("Error al reproducir el audio: ", error);
    });
  }
}
