import { Injectable, Injector } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

const PROFILE = 'profile';

export interface User {
  id;
  avatar: string;
  loginName: string;
  realName: string;
  email: string;
  mobile: string;
  address: string;
  detail: string;
  status: string;
  token: string;
  permissions: any;
  [key: string]: any;
}

export interface App {
  name: string;
  description: string;
  year: number;
  [key: string]: any;
}

@Injectable()
export class SettingService {
  app: App = {
    name: '惠小蜜管理平台',
    description: '惠小蜜管理平台',
    year: new Date().getFullYear(),
    version: 'v0.0.1',
  };

  _user: User = null;

  get isAuth() {
    return this.user != null;
  }

  get token() {
    return this.user.token;
  }

  get user() {
    if (this._user) {
      return this._user;
    }
    const str = this.session.get(PROFILE);
    if (str) {
      this._user = JSON.parse(str);
    } else {
      this.goTo('/passport/login');
    }
    return this._user;
  }

  public setProfile(profile) {
    if (profile) {
      this._user = {
        id: profile.user.id,
        token: profile.token,
        avatar: this.defaultAvatar(profile.user.avatar),
        loginName: profile.user.loginName,
        realName: profile.user.realName,
        email: profile.user.email,
        mobile: profile.user.mobile,
        address: profile.user.address,
        detail: profile.user.detail,
        status: profile.user.status,
        permissions: ['*:*'],
      };
      this.session.set(PROFILE, JSON.stringify(this._user));
    } else {
      this._user = null;
      this.session.set(PROFILE, null);
    }
  }

  public updateProfile(user) {
    if (user) {
      this._user = user;
      this.session.set(PROFILE, JSON.stringify(this._user));
    } else {
      this._user = null;
      this.session.set(PROFILE, null);
    }
  }

  private defaultAvatar(avatar: string) {
    if (avatar !== null && avatar !== '') {
      return avatar;
    }
    return './assets/tmp/img/avatar.jpg';
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  constructor(private session: SessionStorageService, private injector: Injector) {}
}
