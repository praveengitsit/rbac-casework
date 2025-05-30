import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

  getRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesApiEndpoint).pipe(
      tap((roles) => {
        this.roleListSubject.next(roles);
      }),
      catchError((err) => {
        console.error('Error fetching roles:', err);
        this.roleListSubject.next([]);
        return throwError(
          () => new Error('Failed to fetch roles: ' + err.message),
        );
      }),
    );
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.rolesApiEndpoint, role).pipe(
      tap((addedRole) => {
        const currentRoles = this.roleListSubject.getValue();
        this.roleListSubject.next([...currentRoles, addedRole]);
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  updateRole(role: Role): Observable<Role> {
    return this.http
      .put<Role>(`${this.rolesApiEndpoint}/${role.name}`, role)
      .pipe(
        tap((updatedRole) => {
          const currentRoles = this.roleListSubject.getValue();
          const updatedRoles = currentRoles.map((role) =>
            role.name === updatedRole.name ? updatedRole : role,
          );
          this.roleListSubject.next(updatedRoles);
        }),
        catchError((err) => {
          console.error('Error updating role:', err);
          return throwError(() => new Error(err.message));
        }),
      );
  }

  deleteRole(role: Role): Observable<string> {
    return this.http
      .delete<string>(`${this.rolesApiEndpoint}/${role.name}`)
      .pipe(
        tap(() => {
          const currentRoles = this.roleListSubject.getValue();
          const updatedRoles = currentRoles.filter((r) => r.name !== role.name);
          this.roleListSubject.next(updatedRoles);
        }),
        catchError((err) => {
          console.error('Error deleting role:', err);
          return throwError(() => err.error);
        }),
      );
  }
}
