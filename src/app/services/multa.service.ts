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

  async init(): Promise<void> {
    this._storage = await this.storage.create();
    await this.loadMultas();
  }

  async loadMultas() {
    const multas = await this.obtenerMultas();
    this.multasSubject.next(multas);
  }

  get multas$() {
    return this.multasSubject.asObservable();
  }

  async guardarMulta(multa: Multa) {
    const multas = await this.obtenerMultas() || [];
    multa.id = multas.length > 0 ? multas[multas.length - 1].id! + 1 : 1;
    multas.push(multa);
    await this._storage?.set('multas', multas);
    this.multasSubject.next(multas);  // Emitir la lista actualizada
  }

  async obtenerMultas(): Promise<Multa[]> {
    return (await this._storage?.get('multas')) || [];
  }

  async obtenerMultaPorId(id: number): Promise<Multa | undefined> {
    const multas = await this.obtenerMultas();
    return multas.find(multa => multa.id === id);
  }

  async eliminarMulta(id: number) {
    const multas = await this.obtenerMultas();
    const nuevasMultas = multas.filter(multa => multa.id !== id);
    await this._storage?.set('multas', nuevasMultas);
    this.multasSubject.next(nuevasMultas);
  }
}
