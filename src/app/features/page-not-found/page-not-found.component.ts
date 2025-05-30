import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatIcon, RouterModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/home');
  }
}
