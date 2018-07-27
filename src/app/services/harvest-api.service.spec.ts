import { TestBed, inject } from '@angular/core/testing';

import { HarvestApiService } from '@app/services/harvest-api.service';

describe('HarvestApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HarvestApiService]
    });
  });

  it('should be created', inject([HarvestApiService], (service: HarvestApiService) => {
    expect(service).toBeTruthy();
  }));
});
