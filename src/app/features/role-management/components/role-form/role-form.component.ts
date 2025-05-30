import { Component, OnInit, Inject, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PermissionService } from '../../../../core/services/permission.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppPermission } from '../../../../core/models/app-permission';
import { MatInputModule } from '@angular/material/input';
import { PermissionInViewPipe } from '../../../../core/pipes/permission-in-view.pipe';
import { TitleCasePipe } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from '../../models/role';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  imports: [
    MatLabel,
    MatError,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    PermissionInViewPipe,
    TitleCasePipe,
    MatButtonModule,
  ],
})
export class RoleFormComponent implements OnInit, OnDestroy {
  // protected readonly matDialogData: {
  //   roleToEdit: Role;
  // } = inject(MAT_DIALOG_DATA);

  protected permissionListSubscription: Subscription | undefined;

  roleForm: FormGroup;
  availablePermissions: AppPermission[] = [];
  // isEditMode = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<RoleFormComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA)
    protected readonly matDialogData: {
      roleToEdit: Role;
    },
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      permissionList: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.matDialogData.roleToEdit !== undefined) {
      this.roleForm.patchValue({
        name: this.matDialogData.roleToEdit.name,
        permissionList: this.matDialogData.roleToEdit.permissionList,
      });

      const nameFormFieldControl = this.roleForm.get('name');
      if (nameFormFieldControl) {
        nameFormFieldControl.disable();
      }
    }

    this.permissionListSubscription = this.permissionService
      .getPermissionList()
      .subscribe((availablePermissions) => {
        this.availablePermissions = availablePermissions.filter(
          (permission) => permission.assignable,
        );
      });
  }

  get name() {
    return this.roleForm.get('name');
  }
  get permissionList() {
    return this.roleForm.get('permissionList');
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const currentRole: Role = {
      name: this.roleForm.controls['name'].value,
      permissionList: this.roleForm.value.permissionList,
    };

    if (!this.matDialogData.roleToEdit) {
      this.addNewRole(currentRole);
    } else {
      this.updateExistingRole(currentRole);
    }
  }

  addNewRole(newRole: Role) {
    this.roleService.addRole(newRole).subscribe({
      next: (addedRole) => {
        this._snackBar.open('Role added successfully', 'OK', {
          duration: 3000,
        });
        this.dialogRef.close(addedRole);
      },
      error: (err) => {
        if (err.status === 409) {
          this.setRoleNameAlreadyExistsError();
        } else {
          this._snackBar.open('Failed to add role!', 'OK', {
            duration: 3000,
          });
        }
      },
    });
  }

  updateExistingRole(updatedRole: Role) {
    this.roleService.updateRole(updatedRole).subscribe({
      next: (updatedRole) => {
        this._snackBar.open('Role updated successfully', 'OK', {
          duration: 3000,
        });
        this.dialogRef.close(updatedRole);
      },
      error: (err) => {
        if (err.status === 409) {
          this.setRoleNameAlreadyExistsError();
        } else {
          this._snackBar.open('Failed to add role!', 'OK', {
            duration: 3000,
          });
        }
      },
    });
  }

  setRoleNameAlreadyExistsError() {
    this.name?.setErrors({ roleNameAlreadyExists: true });
  }

  ngOnDestroy(): void {
    if (this.permissionListSubscription) {
      this.permissionListSubscription.unsubscribe();
    }
  }
}
