import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/components/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { roleAndPermissionGuard } from './core/guards/role-and-permission.guard';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      {
        path: 'landing',
        loadComponent: () =>
          import('./features/landing/landing.component').then(
            (m) => m.LandingComponent,
          ),
      },
      {
        path: 'roles',
        canActivate: [roleAndPermissionGuard],
        loadComponent: () =>
          import(
            './features/role-management/components/role-management/role-management.component'
          ).then((m) => m.RoleManagementComponent),
      },
      {
        path: 'users',
        canActivate: [roleAndPermissionGuard],
        loadComponent: () =>
          import(
            './features/user-management/components/user-management/user-management.component'
          ).then((m) => m.UserManagementComponent),
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
