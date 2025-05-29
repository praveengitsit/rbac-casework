import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Role } from '../../models/role'; // Ensure Role model is imported if not already
import { RoleService } from '../../services/role.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RoleFormComponent } from '../role-form/role-form.component';
import { PermissionInViewPipe } from '../../../../core/pipes/permission-in-view.pipe';
import { TitleCasePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogInterface } from '../../../../shared/components/confirmation-dialog/confirmation-dialog-interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-role-management',
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PermissionInViewPipe,
    TitleCasePipe,
    MatChipsModule,
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
  private _snackBar = inject(MatSnackBar);

  constructor(
    private roleService: RoleService,
    private matDialog: MatDialog,
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
    const dialogRef = this.matDialog.open(RoleFormComponent, {
      width: '500px', // Example width
      // You can pass data to the matDialog if needed, e.g., for editing
      data: { roleToEdit },
    });
  }

  openConfirmDialog(roleToDelete: Role) {
    const confirmationDialogDetails: ConfirmationDialogInterface = {
      title: 'Confirm',
      content: `Are you sure you want to delete "${roleToDelete.name}" role?`,
      confirmText: 'Delete role!',
      cancelText: 'Go back',
    };

    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        confirmationDialogDetails,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined && result === 'confirm') {
        this.deleteRole(roleToDelete);
      }
    });
  }

  deleteRole(roleToDelete: Role) {
    this.roleService.deleteRole(roleToDelete).subscribe({
      next: () => {
        this._snackBar.open('Role deleted successfully', 'OK', {
          duration: 3000,
        });
      },
      error: () => {
        this._snackBar.open('Failed to delete role', 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
