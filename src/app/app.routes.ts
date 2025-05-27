import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/components/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/role-management/role-management.component').then(
            (m) => m.RoleManagementComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/user-management/user-management.component').then(
            (m) => m.UserManagementComponent,
          ),
      },
    ],
  },
];
