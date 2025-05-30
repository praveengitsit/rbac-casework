import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatLabel,
  MatError,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../role-management/services/role.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users';
import { Subscription } from 'rxjs';
import { Role } from '../../../role-management/models/role';
import { noWhitespaceValidator } from '../../../../core/validators/no-white-space.validator';
import { AuthService } from '../../../auth/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [
    MatLabel,
    MatError,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  protected userForm: FormGroup;
  private _snackBar = inject(MatSnackBar);

  protected roleListSubscription: Subscription | undefined;
  protected availableRoles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private roleService: RoleService,
    private userService: UserService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    protected readonly matDialogData: {
      userToEdit: User;
    },
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, noWhitespaceValidator()]],
      password: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', Validators.pattern('[- +()0-9]{10,12}')],
      department: [''],
      roleName: ['', [Validators.required]],
    });
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

  get email() {
    return this.userForm.get('email');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get department() {
    return this.userForm.get('department');
  }

  get roleName() {
    return this.userForm.get('roleName');
  }

  ngOnInit(): void {
    if (this.matDialogData.userToEdit !== undefined) {
      this.userForm.patchValue({
        firstName: this.matDialogData.userToEdit.firstName,
        lastName: this.matDialogData.userToEdit.lastName,
        username: this.matDialogData.userToEdit.username,
        email: this.matDialogData.userToEdit.email,
        phone: this.matDialogData.userToEdit.phone,
        department: this.matDialogData.userToEdit.department,
        roleName: this.matDialogData.userToEdit.role,
      });

      if (this.username) {
        this.username.disable();
      }
    }

    this.roleListSubscription = this.roleService
      .getRoleList()
      .subscribe((availableRoles) => {
        this.availableRoles = availableRoles.filter(
          (availableRole) => availableRole.name !== 'superadmin',
        );
      });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userInForm: User = {
      firstName: this.firstName?.value,
      lastName: this.lastName?.value,
      username: this.username?.value,
      password:
        this.matDialogData.userToEdit === undefined
          ? this.password?.value
          : null,
      email: this.email?.value,
      phone: this.phone?.value,
      department: this.department?.value,
      role: this.roleName?.value,
    };

    if (!this.matDialogData.userToEdit) {
      this.addNewUser(userInForm);
    } else {
      this.updateExistingUser(userInForm);
    }
  }

  addNewUser(user: User) {
    this.userService.addUser(user).subscribe({
      next: (addedUser) => {
        this._snackBar.open('User added successfully', 'OK', {
          duration: 3000,
        });
        this.dialogRef.close(addedUser);
      },
      error: (err) => {
        // this.name?.setErrors(err);
      },
    });
  }

  updateExistingUser(user: User) {
    this.userService.updateUser(user).subscribe({
      next: (updatedUser) => {
        this._snackBar.open('User updated successfully', 'OK', {
          duration: 3000,
        });
        this.dialogRef.close(updatedUser);
      },
      error: (err) => {
        // this.name?.setErrors(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.roleListSubscription) {
      this.roleListSubscription.unsubscribe();
    }
  }
}
