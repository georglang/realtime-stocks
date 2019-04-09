/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlphavantageService } from './alphavantage-service';

describe('Service: AlphavantageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlphavantageService]
    });
  });

  it('should ...', inject([AlphavantageService], (service: AlphavantageService) => {
    expect(service).toBeTruthy();
  }));
});
