import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/users';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseURL = environment.apiUrl;
  private readonly usersApiEndpoint = `${this.baseURL}/api/users`;

  private userListSubject = new BehaviorSubject<User[]>([]);
  public userList$: Observable<User[]> = this.userListSubject.asObservable();

  constructor(private http: HttpClient) {
    //
  }

  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiEndpoint).pipe(
      tap((users) => {
        this.userListSubject.next(users);
      }),
      catchError((err) => {
        console.error('Error fetching users:', err);
        this.userListSubject.next([]); // Emit empty array on error to clear previous state
        return throwError(
          () => new Error('Failed to fetch users: ' + err.message),
        );
      }),
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersApiEndpoint, user).pipe(
      tap((addedUser) => {
        const currentUsers = this.userListSubject.getValue();
        this.userListSubject.next([...currentUsers, addedUser]);
      }),
      catchError((err) => {
        console.error('Error adding user:', err);
        return throwError(() => new Error(err.message));
      }),
    );
  }

  updateUser(user: User): Observable<User> {
    // Assuming a RESTful API where PUT updates a resource by its ID in the URL
    return this.http
      .put<User>(`${this.usersApiEndpoint}/${user.username}`, user)
      .pipe(
        tap((updatedUser) => {
          const currentUsers = this.userListSubject.getValue();
          const updatedUsers = currentUsers.map((user) =>
            user.username === updatedUser.username ? updatedUser : user,
          );
          this.userListSubject.next(updatedUsers);
        }),
        catchError((err) => {
          console.error('Error updating user:', err);
          return throwError(() => new Error(err.message));
        }),
      );
  }

  deleteUser(user: User): Observable<string> {
    return this.http
      .delete<string>(`${this.usersApiEndpoint}/${user.username}`)
      .pipe(
        tap(() => {
          const currentUsers = this.userListSubject.getValue();
          const updatedUsers = currentUsers.filter(
            (r) => r.username !== user.username,
          );
          this.userListSubject.next(updatedUsers);
        }),
        catchError((err) => {
          console.error('Error deleting user:', err);
          return throwError(
            () => new Error(err.message || 'Failed to delete user'),
          );
        }),
      );
  }
}
