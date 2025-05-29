import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Role } from '../../models/role'; // Ensure Role model is imported if not already
import { RoleService } from '../../services/role.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RoleFormComponent } from '../role-form/role-form.component';

@Component({
  selector: 'app-role-management',
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  protected displayedColumns: string[] = [
    'name',
    'permissionList',
    'actionList',
  ];

  protected roles: Role[] = [];

  protected roleListSubscription: Subscription | undefined;

  @ViewChild(MatTable) table!: MatTable<Role>;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.roleListSubscription = this.roleService.roleList$.subscribe(
      (fetchedRoles) => {
        this.roles = fetchedRoles;
        if (this.table && this.roles) {
          this.table.renderRows();
        }
      },
    );

    this.roleService.getRoleList().subscribe({
      next: () => console.log('Initial role list check/load triggered.'),
      error: (err) =>
        console.error('Error during initial role list check/load:', err),
    });
  }

  ngOnDestroy(): void {
    if (this.roleListSubscription) {
      this.roleListSubscription.unsubscribe();
    }
  }

  openRoleForm(roleToEdit?: Role) {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px', // Example width
      // You can pass data to the dialog if needed, e.g., for editing
      data: { roleToEdit: roleToEdit },
    });
    // dialogRef.componentInstance?.formSubmit.subscribe((formData: Role) => {
    //   if (formData.id) {
    //     // Assuming presence of ID means it's an edit
    //     this.roleService.updateRole(formData).subscribe({
    //       next: () => console.log('Role updated successfully via dialog'),
    //       error: (err) => console.error('Error updating role from dialog', err),
    //     });
    //   } else {
    //     this.roleService.addRole(formData).subscribe({
    //       next: () => console.log('Role added successfully via dialog'),
    //       error: (err) => console.error('Error adding role from dialog', err),
    //     });
    //   }
    // });
  }
}
