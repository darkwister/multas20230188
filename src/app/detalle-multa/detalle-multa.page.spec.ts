import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMultaPage } from './detalle-multa.page';

describe('DetalleMultaPage', () => {
  let component: DetalleMultaPage;
  let fixture: ComponentFixture<DetalleMultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
