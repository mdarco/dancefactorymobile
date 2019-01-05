import { TestBed } from '@angular/core/testing';

import { UserAuthenticatedGuardService } from './user-authenticated-guard.service';

describe('UserAuthenticatedGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAuthenticatedGuardService = TestBed.get(UserAuthenticatedGuardService);
    expect(service).toBeTruthy();
  });
});
