import { TestBed } from '@angular/core/testing';

import { DanceGroupsService } from './dance-groups.service';

describe('DanceGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DanceGroupsService = TestBed.get(DanceGroupsService);
    expect(service).toBeTruthy();
  });
});
