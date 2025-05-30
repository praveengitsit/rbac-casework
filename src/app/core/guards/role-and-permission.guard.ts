import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map } from 'rxjs/internal/operators/map';

export const roleAndPermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedInUser$.pipe(
    map((loggedInUser) => {
      const attemptingToAccessRoutePath = route.routeConfig?.path;

      if (
        attemptingToAccessRoutePath === 'roles' &&
        loggedInUser?.role === 'superadmin'
      ) {
        return true;
      }

      const hasUserViewPermissions =
        loggedInUser?.permissions.includes('view_users');

      if (attemptingToAccessRoutePath === 'users' && hasUserViewPermissions) {
        return true;
      }

      return false;

      // if (loggedInUser) {
      //   console.log('Authenticated');
      //   return true;
      // } else {
      //   this.router.navigate(['/login']);
      //   return false;
      // }
    }),
  );
};
