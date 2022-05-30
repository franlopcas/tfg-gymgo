import { TestBed } from '@angular/core/testing';

import { TablasService } from './tablas.service';

describe('TablasService', () => {
  let service: TablasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
