import { TestBed } from '@angular/core/testing';

import { EjerciciosService } from './ejercicios.service';

describe('EjerciciosService', () => {
  let service: EjerciciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjerciciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
