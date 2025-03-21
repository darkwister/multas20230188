import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonInput, IonButton, IonTextarea, IonSelect, IonSelectOption, IonDatetime, IonProgressBar } from '@ionic/angular/standalone';
import { MultaService } from '../services/multa.service';
import { Multa } from '../classes/multa';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonProgressBar, CommonModule, IonDatetime, IonSelectOption, IonSelect, IonTextarea, IonButton, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, ReactiveFormsModule],
})
export class Tab1Page implements OnInit, AfterViewInit {
  public multaForm!: FormGroup;
  public tiposInfraccion: string[] = ['Exceso de velocidad', 'Estacionamiento indebido', 'No usar cinturón', 'Uso de celular'];
  public map!: L.Map;
  private marker: L.Marker | undefined; 
  public ubicacion: string = '';
  loading?: boolean;
  public imageUrl: string | undefined;
  public audioUrl: string | undefined;
  public grabando: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private multaService: MultaService, private router: Router) {}

  ngOnInit() {
    this.multaForm = this.fb.group({
      codigoMarbete: ['', Validators.required],
      marca: [{ value: '', disabled: true }],
      modelo: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      anio: [{ value: '', disabled: true }],
      placa: [{ value: '', disabled: true }],
      tipoInfraccion: [this.tiposInfraccion[0], Validators.required],
      descripcion: ['', Validators.required],
      fechaHora: [format(new Date(), 'yyyy-MM-dd HH:mm:ss')],
      ubicacion: [this.ubicacion],
      imagen: [''],
      audio: ['']
    });
  }

  ngAfterViewInit() {
    this.loadMap();
    if (this.map) {
      console.log('Mapa cargado correctamente.');
    } else {
      console.error('Error: El mapa no se cargó correctamente.');
    }
  }

  async buscarVehiculo() {
    const codigo = this.multaForm.get('codigoMarbete')?.value;
    if (!codigo) return;
  
    this.loading = true;
    console.log('Buscando vehículo...');
    
    this.http.get(`https://api.adamix.net/itla.php?m=${codigo}`).subscribe(
      async (data: any) => {
        if (data && data.ok === 1) {
          console.log('Vehiculo encontrado:', data);
  
          // Actualizar los valores del formulario con los datos obtenidos de la API
          this.multaForm.patchValue({
            marca: data.marca || '',
            modelo: data.modelo || '',
            color: data.color || '',
            anio: data.anio || '',
            placa: data.placa || ''
          });
  
          // Habilitar los campos del formulario
          this.multaForm.get('marca')?.enable();
          this.multaForm.get('modelo')?.enable();
          this.multaForm.get('color')?.enable();
          this.multaForm.get('anio')?.enable();
          this.multaForm.get('placa')?.enable();
        } else {
          console.error('Error: No se encontraron datos válidos para el vehículo.');
        }
      },
      (error) => {
        console.error('Error al obtener los datos del vehículo', error);
      },
      () => {
        this.loading = false;
        console.log('Datos del formulario después de la búsqueda:', this.multaForm.value);
      }
    );
  }  
    async registrarMulta() {
    if (!this.multaForm.valid) {
      return;
    }
  
    const codigo = this.multaForm.get('codigoMarbete')?.value;
    if (!codigo) {
      alert('Por favor, ingrese un código de marbete válido.');
      return;
    }
  
    // Solo ejecuta la búsqueda si el vehículo aún no se ha encontrado
    if (!this.multaForm.get('marca')?.value) {
      await this.buscarVehiculo();
    }
  
    const nuevaMulta: Multa = {
      marbete: this.multaForm.value.codigoMarbete,
      marca: this.multaForm.value.marca,
      modelo: this.multaForm.value.modelo,
      color: this.multaForm.value.color,
      anio: this.multaForm.value.anio,
      placa: this.multaForm.value.placa,
      tipoInfraccion: this.multaForm.value.tipoInfraccion,
      descripcion: this.multaForm.value.descripcion,
      fechaHora: this.multaForm.value.fechaHora,
      ubicacion: this.multaForm.value.ubicacion,
      imagen: this.multaForm.value.imagen,
      audio: this.multaForm.value.audio,
    };
  
    if (!nuevaMulta.ubicacion) {
      alert('La ubicación es requerida para registrar la multa.');
      return;
    }
  
    await this.multaService.guardarMulta(nuevaMulta);
    console.log('Multa registrada:', nuevaMulta);
    this.router.navigate(['tabs/tab2']);
  }
  
  loadMap() {
    this.map = L.map('map').setView([18.7357, -70.1627], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));

    this.map.invalidateSize();
  }

  onMapClick(e: L.LeafletMouseEvent) {
    if (e && e.latlng && e.latlng.lat !== undefined && e.latlng.lng !== undefined) {
      const latLng = e.latlng;
      console.log('Click en el mapa:', latLng);
  
      if (this.marker) {
        this.marker.remove();
      }
  
      const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png', 
        shadowUrl: 'assets/marker-shadow.png', 
        iconSize: [25, 41],
        iconAnchor: [12, 41], 
        popupAnchor: [1, -34], 
        shadowSize: [41, 41] 
      });
  
      this.marker = L.marker([latLng.lat, latLng.lng], { icon: customIcon }).addTo(this.map);
      
      this.ubicacion = `${latLng.lat}, ${latLng.lng}`;
      this.multaForm.patchValue({ ubicacion: this.ubicacion });
    } else {
      console.error('Error: No se pudo obtener latLng del evento de clic.');
    }
  }
  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, 
      source: CameraSource.Camera,
    });
  
    if (image.base64String) {
      this.imageUrl = `data:image/jpeg;base64,${image.base64String}`;
      this.multaForm.patchValue({ imagen: this.imageUrl });
    }
  }

  async iniciarGrabacion() {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();
    if (!permission.value) {
      alert('Permiso de grabación denegado');
      return;
    }
    this.grabando = true;
    await VoiceRecorder.startRecording();
  }

  async detenerGrabacion() {
    const result: RecordingData = await VoiceRecorder.stopRecording();
    this.grabando = false;

    if (result.value && result.value.recordDataBase64) {
      this.audioUrl = `data:audio/aac;base64,${result.value.recordDataBase64}`;
      this.multaForm.patchValue({ audio: this.audioUrl });
      console.log('Audio guardado:', this.audioUrl);
    } else {
      console.error('Error al obtener la grabación de audio');
    }
  }
}
