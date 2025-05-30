import { Component, Inject } from '@angular/core';
import { User } from '../../models/users';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    TitleCasePipe,
    MatDialogModule,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly matDialogData: {
      user: User;
    },
  ) {
    this.user = matDialogData.user;
  }
}
