import { TestBed } from '@angular/core/testing';

import { fetchAPIDataService } from './fetch-api-data.service';

describe('FetchApiDataService', () => {
  let service: fetchAPIDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(fetchAPIDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
