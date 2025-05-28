import { Component, OnInit } from '@angular/core';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-role-management',
  imports: [],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent implements OnInit {
  public roles: Role[] = [];

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.getRoleList();
  }

  public getRoleList(): void {
    this.roleService.getRoleList().subscribe((roles) => {
      this.roles = roles;
    });
  }
}
