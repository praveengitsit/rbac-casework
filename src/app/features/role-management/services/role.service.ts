import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly baseURL = environment.apiUrl;
  private readonly rolesApiEndpoint = `${this.baseURL}/api/roles`;

  constructor(private http: HttpClient) {
    //
  }

  getRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesApiEndpoint);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.rolesApiEndpoint, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(this.rolesApiEndpoint, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rolesApiEndpoint}/${id}`);
  }
}
