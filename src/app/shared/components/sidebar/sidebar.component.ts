import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, Observable, share, shareReplay, switchMap } from 'rxjs';
import { ExtendedUser } from '../../../features/user-management/models/users';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    MatIcon,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  loggedInUser$: Observable<ExtendedUser | null>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loggedInUser$ = this.authService.loggedInUser$.pipe(shareReplay());
  }
}
