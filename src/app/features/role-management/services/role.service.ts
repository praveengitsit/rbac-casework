import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly baseURL = environment.apiUrl;
  private readonly getRolesApiEndpoint = `${this.baseURL}/protected/roles`;

  constructor() {}
}
