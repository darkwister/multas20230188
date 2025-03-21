import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Multa } from '../classes/multa';

@Injectable({
  providedIn: 'root'
})
export class MultaService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async guardarMulta(multa: Multa) {
    const multas = await this.obtenerMultas() || [];
    multa.id = multas.length > 0 ? multas[multas.length - 1].id! + 1 : 1;
    multas.push(multa);
    await this._storage?.set('multas', multas);
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
  }
}
