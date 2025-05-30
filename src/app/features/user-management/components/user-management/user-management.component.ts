import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExtendedUser, User } from '../../models/users';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogInterface } from '../../../../shared/components/confirmation-dialog/confirmation-dialog-interface';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../auth/services/auth.service';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  imports: [
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
  ],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  protected displayedColumns: string[] = [
    'fullName',
    'username',
    'department',
    'role',
    'actions',
  ];

  protected users: User[] = [];

  protected userListSubscription: Subscription | undefined;
  protected loggedInUserPermissionsBoolean: {
    hasUserCreatePermission: boolean;
    hasUserViewPermission: boolean;
    hasUserEditPermission: boolean;
    hasUserDeletePermission: boolean;
  } = {
    hasUserCreatePermission: false,
    hasUserViewPermission: false,
    hasUserEditPermission: false,
    hasUserDeletePermission: false,
  };

  @ViewChild(MatTable) table!: MatTable<User>;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    const loggedInUserPermissions = loggedInUser?.permissions ?? [];

    this.loggedInUserPermissionsBoolean = {
      hasUserCreatePermission: loggedInUserPermissions.includes('create_users'),
      hasUserViewPermission: loggedInUserPermissions.includes('view_users'),
      hasUserEditPermission: loggedInUserPermissions.includes('edit_users'),
      hasUserDeletePermission: loggedInUserPermissions.includes('delete_users'),
    };

    this.userListSubscription = this.userService.userList$.subscribe(
      (fetchedUsers) => {
        this.users = fetchedUsers;
        if (this.table && this.users) {
          this.table.renderRows();
        }
      },
    );

    this.userService.getUserList().subscribe({
      next: () => console.log('Initial user list check/load triggered.'),
      error: (err) =>
        console.error('Error during initial user list check/load:', err),
    });
  }

  openUserDetails(user?: User) {
    const dialogRef = this.matDialog.open(UserDetailsComponent, {
      maxWidth: '60vw',
      // You can pass data to the matDialog if needed, e.g., for editing
      data: { user },
    });
  }

  openUserAddOrEditForm(userToEdit?: User) {
    const dialogRef = this.matDialog.open(UserFormComponent, {
      maxWidth: '60vw',
      // You can pass data to the matDialog if needed, e.g., for editing
      data: { userToEdit },
    });
  }

  openConfirmDialog(userToDelete: User) {
    const confirmationDialogDetails: ConfirmationDialogInterface = {
      title: 'Confirm',
      content: `Are you sure you want to delete the user "${userToDelete.username}"?`,
      confirmText: 'Delete user!',
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
        this.deleteUser(userToDelete);
      }
    });
  }

  deleteUser(userToDelete: User) {
    this.userService.deleteUser(userToDelete).subscribe({
      next: () => {
        this._snackBar.open('User deleted successfully', 'OK', {
          duration: 3000,
        });
      },
      error: () => {
        this._snackBar.open('Failed to delete user', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
  }
}
