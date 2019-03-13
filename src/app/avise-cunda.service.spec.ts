import { TestBed } from '@angular/core/testing';

import { AviseCundaService } from './avise-cunda.service';

describe('AviseCundaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AviseCundaService = TestBed.get(AviseCundaService);
    expect(service).toBeTruthy();
  });
});
