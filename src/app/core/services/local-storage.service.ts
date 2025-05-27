import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly accessTokenKey = 'accessToken';

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
}
