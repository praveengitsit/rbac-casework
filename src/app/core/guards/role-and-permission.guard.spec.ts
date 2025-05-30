import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleAndPermissionGuard } from './role-and-permission.guard';

describe('roleAndPermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleAndPermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
