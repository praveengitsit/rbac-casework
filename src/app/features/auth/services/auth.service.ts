import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponse } from '../models/auth-response';
import { tap } from 'rxjs/internal/operators/tap';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { map } from 'rxjs/internal/operators/map';
import { LoginUserRequest } from '../login/models/login-user-request';
import { ExtendedUser, User } from '../../user-management/models/users';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseURL = environment.apiUrl;
  private readonly loginApiEndpoint = `${this.baseURL}/login`;

  private localStorageService = inject(LocalStorageService);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.checkAuth(),
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private loggedInUserSubject = new BehaviorSubject<ExtendedUser | null>(
    this.getLoggedInUser(),
  );
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor(private http: HttpClient) {
    //
  }

  private checkAuth(): boolean {
    const isAccessTokenAvailable = this.getAccessToken() ? true : false;
    return isAccessTokenAvailable;
  }

  getAccessToken(): string | null {
    return this.localStorageService.getAccessToken();
  }

  login(loginUserRequest: LoginUserRequest): Observable<boolean> {
    return this.http
      .post<AuthResponse>(this.loginApiEndpoint, loginUserRequest)
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.localStorageService.setAccessToken(response.accessToken);
            this.setLoggedInUser(response.user!);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.isAuthenticatedSubject.next(false);
          }
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
        map((response) => !!response.accessToken),
      );
  }

  getLoggedInUser(): ExtendedUser | null {
    return this.localStorageService.getUser();
  }

  private setLoggedInUser(user: ExtendedUser): void {
    this.localStorageService.setUser(user);
    this.loggedInUserSubject.next(user);
  }

  removeLoggedInUser(): void {
    this.localStorageService.deleteUser();
  }

  logout(): void {
    this.localStorageService.deleteAccessToken();
    this.localStorageService.deleteUser();
    this.isAuthenticatedSubject.next(false);
  }
}
