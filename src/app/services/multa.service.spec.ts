import { TestBed } from '@angular/core/testing';

import { MultaService } from './multa.service';

describe('MultaService', () => {
  let service: MultaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
