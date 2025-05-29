import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AppPermission } from '../models/app-permission';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly baseURL = environment.apiUrl;
  private readonly permissionsApiEndpoint = `${this.baseURL}/api/permissions`;

  constructor(private http: HttpClient) {
    //
  }

  getPermissionList(): Observable<AppPermission[]> {
    return this.http.get<AppPermission[]>(this.permissionsApiEndpoint).pipe(
      catchError((err) => {
        console.error('Error fetching permissions:', err);
        return throwError(
          () => new Error('Failed to fetch permissions: ' + err.message),
        );
      }),
    );
  }
}
