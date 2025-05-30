import { Injectable } from '@angular/core';
import {
  ExtendedUser,
  User,
} from '../../features/user-management/models/users';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly accessTokenKey = 'accessToken';
  private readonly userKey = 'user';

  private setItem(itemKey: string, itemValue: string) {
    return localStorage.setItem(itemKey, itemValue);
  }

  private getItem(itemKey: string) {
    return localStorage.getItem(itemKey);
  }

  private removeItem(itemKey: string) {
    return localStorage.removeItem(itemKey);
  }

  setAccessToken(accessToken: string) {
    return this.setItem(this.accessTokenKey, accessToken);
  }

  getAccessToken() {
    try {
      return this.getItem(this.accessTokenKey);
    } catch {
      return null;
    }
  }

  deleteAccessToken() {
    return this.removeItem(this.accessTokenKey);
  }

  setUser(user: ExtendedUser) {
    return this.setItem('user', JSON.stringify(user));
  }

  getUser(): ExtendedUser | null {
    try {
      const userString = this.getItem(this.userKey);
      if (userString) {
        return JSON.parse(userString) as ExtendedUser;
      }
      return null;
    } catch {
      return null;
    }
  }

  deleteUser() {
    return this.removeItem('user');
  }
}
