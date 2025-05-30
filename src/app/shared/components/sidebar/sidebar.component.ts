import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { ExtendedUser } from '../../../features/user-management/models/users';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatNavList,
    MatListItem,
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
