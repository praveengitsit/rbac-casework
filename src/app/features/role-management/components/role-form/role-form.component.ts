import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PermissionService } from '../../../../core/services/permission.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppPermission } from '../../../../core/models/app-permission';
import { MatInputModule } from '@angular/material/input';

export interface Role {
  id?: string | number; // Optional for new roles
  name: string;
  permissionList: string[];
}

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
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
})
export class RoleFormComponent implements OnInit, OnChanges {
  @Input() roleToEdit: Role | null = null;
  @Output() formSubmit = new EventEmitter<Role>();

  protected permissionListSubscription: Subscription | undefined;

  roleForm: FormGroup;
  availablePermissions: AppPermission[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      permissionList: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.roleToEdit) {
      this.isEditMode = true;
      this.roleForm.patchValue(this.roleToEdit);
    }

    this.permissionListSubscription = this.permissionService
      .getPermissionList()
      .subscribe((availablePermissions) => {
        this.availablePermissions = availablePermissions.filter(
          (permission) => permission.assignable,
        );
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roleToEdit'] && this.roleToEdit) {
      this.isEditMode = true;
      this.roleForm.patchValue(this.roleToEdit);
    } else if (changes['roleToEdit'] && !this.roleToEdit) {
      this.isEditMode = false;
      this.roleForm.reset({ name: '', permissionList: [] });
    }
  }

  get name() {
    return this.roleForm.get('name');
  }
  get permissionList() {
    return this.roleForm.get('permissionList');
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const formData = this.roleForm.value;
      if (this.isEditMode && this.roleToEdit) {
        this.formSubmit.emit({ ...this.roleToEdit, ...formData });
      } else {
        this.formSubmit.emit(formData);
      }
      // Optionally reset form after submission for 'add' mode
      // if (!this.isEditMode) {
      //   this.roleForm.reset({ name: '', permissionList: [] });
      // }
    }
  }
}
