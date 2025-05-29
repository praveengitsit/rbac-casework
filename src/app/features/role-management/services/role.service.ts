import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly baseURL = environment.apiUrl;
  private readonly rolesApiEndpoint = `${this.baseURL}/api/roles`;

  private roleListSubject = new BehaviorSubject<Role[]>([]);
  public roleList$: Observable<Role[]> = this.roleListSubject.asObservable();

  constructor(private http: HttpClient) {
    //
  }

  /**
   * Fetches the list of roles from the API and updates the roles$ stream.
   * Subscribers to roles$ will receive the new list.
   * @returns Observable<Role[]> The fetched roles.
   */
  getRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesApiEndpoint).pipe(
      tap((roles) => {
        this.roleListSubject.next(roles);
      }),
      catchError((err) => {
        console.error('Error fetching roles:', err);
        this.roleListSubject.next([]); // Emit empty array on error to clear previous state
        return throwError(
          () => new Error('Failed to fetch roles: ' + err.message),
        );
      }),
    );
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.rolesApiEndpoint, role).pipe(
      switchMap((addedRole) =>
        this.getRoleList().pipe(
          // Refresh the list
          map(() => addedRole), // Then return the addedRole
        ),
      ),
    );
  }

  // updateRole(role: Role): Observable<Role> {
  //   if (!role.id) {
  //     return throwError(
  //       () => new Error('Role ID must be provided for an update.'),
  //     );
  //   }
  //   // Assuming a RESTful API where PUT updates a resource by its ID in the URL
  //   return this.http
  //     .put<Role>(`${this.rolesApiEndpoint}/${role.id}`, role)
  //     .pipe(
  //       switchMap((updatedRole) =>
  //         this.getRoleList().pipe(
  //           // Refresh the list
  //           map(() => updatedRole), // Then return the updatedRole
  //         ),
  //       ),
  //     );
  // }

  deleteRole(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.rolesApiEndpoint}/${id}`).pipe(
      switchMap(() =>
        this.getRoleList().pipe(
          // Refresh the list
          map(() => undefined), // deleteRole returns Observable<void>
        ),
      ),
    );
  }
}
