import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '../../models/role';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
  ],
})
export class RoleDetailsComponent {
  role: Role;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly matDialogData: {
      role: Role;
    },
  ) {
    this.role = matDialogData.role;
  }
}
