import { TestBed, inject } from '@angular/core/testing';

import { TimesheetCalculation } from '@app/services/timesheet-calculation.service';

describe('TimesheetCalculationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimesheetCalculation]
    });
  });

  it('should be created', inject([TimesheetCalculation], (service: TimesheetCalculation) => {
    expect(service).toBeTruthy();
  }));
});
