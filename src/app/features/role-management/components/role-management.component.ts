import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Role } from '../models/role';

@Component({
  selector: 'app-role-management',
  imports: [TableModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent {
  public roles: Role[] = [];
}
