import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Multa } from '../classes/multa';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultaService {
  private _storage: Storage | null = null;
  private multasSubject: BehaviorSubject<Multa[]> = new BehaviorSubject<Multa[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }
  // Inicializar el almacenamiento
  async init(): Promise<void> {
    this._storage = await this.storage.create();
    await this.loadMultas();
  }
  // Cargar las multas desde el almacenamiento
  async loadMultas() {
    const multas = await this.obtenerMultas();
    this.multasSubject.next(multas);
  }
  // Obtener el observable de las multas
  get multas$() {
    return this.multasSubject.asObservable();
  }
  // Guardar una nueva multa
  async guardarMulta(multa: Multa) {
    const multas = await this.obtenerMultas() || [];
    multa.id = multas.length > 0 ? multas[multas.length - 1].id! + 1 : 1;
    multas.push(multa);
    await this._storage?.set('multas', multas);
    this.multasSubject.next(multas);  // Emitir la lista actualizada
  }
  // Obtener todas las multas
  async obtenerMultas(): Promise<Multa[]> {
    return (await this._storage?.get('multas')) || [];
  }
  // Obtener una multa por su ID
  async obtenerMultaPorId(id: number): Promise<Multa | undefined> {
    const multas = await this.obtenerMultas();
    return multas.find(multa => multa.id === id);
  }
  // Eliminar una multa por su ID
  async eliminarMulta(id: number) {
    const multas = await this.obtenerMultas();
    const nuevasMultas = multas.filter(multa => multa.id !== id);
    await this._storage?.set('multas', nuevasMultas);
    this.multasSubject.next(nuevasMultas);
  }
  // Eliminar todas las multas existentes
  async eliminarTodo() {
    const multasBorradas: never[] = []
    await this._storage?.set('multas', multasBorradas); 
    this.multasSubject.next(multasBorradas);
  }
}
