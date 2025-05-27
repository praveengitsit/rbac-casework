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

  constructor(private http: HttpClient) {
    //
  }

  private checkAuth(): boolean {
    const isAccessTokenAvailable = this.localStorageService.getAccessToken()
      ? true
      : false;
    return isAccessTokenAvailable;
  }

  login(loginUserRequest: LoginUserRequest): Observable<boolean> {
    return this.http
      .post<AuthResponse>(this.loginApiEndpoint, loginUserRequest)
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.localStorageService.setAccessToken(response.accessToken);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.isAuthenticatedSubject.next(false);
          }
        }),
        map((response) => !!response.accessToken),
      );
  }

  logout(): void {
    this.localStorageService.deleteAccessToken();
    this.isAuthenticatedSubject.next(false);
  }
}
