import { NzMessageService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class UtilService {
  constructor(protected message: NzMessageService, protected location: Location) {}
  public keeper = {};

  public error(message) {
    this.message.error(message, { nzDuration: 3000, nzAnimate: true });
  }

  public success(message) {
    this.message.success(message, { nzDuration: 3000, nzAnimate: true });
  }

  public warning(message) {
    this.message.warning(message, { nzDuration: 3000, nzAnimate: true });
  }

  public getParam(route, key) {
    return route.snapshot.paramMap.get(key);
  }

  public getQueryParam(route, key) {
    return route.snapshot.queryParamMap.get(key);
  }

  public goBack(): void {
    this.location.back();
  }

  public restore() {
    return this.keeper[this.location.path(true)];
  }

  public store(data) {
    this.keeper[this.location.path(true)] = data;
  }
}
