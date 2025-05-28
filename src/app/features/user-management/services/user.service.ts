import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseURL = environment.apiUrl;
  private readonly usersApiEndpoint = `${this.baseURL}/api/users`;

  constructor(private http: HttpClient) {
    //
  }

  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiEndpoint);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersApiEndpoint, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.usersApiEndpoint, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usersApiEndpoint}/${id}`);
  }
}
