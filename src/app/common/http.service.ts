import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UtilService } from './util.service';
import { SettingService } from './setting.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {
  constructor(protected http: HttpClient, protected setting: SettingService, protected util: UtilService) {}

  post(url, args = {}, target: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    url = this.appendToken(url);
    return this.http.post(environment.SERVER.url + url, JSON.stringify(args), { headers }).subscribe((data: any) => {
      try {
        if (null == data || data.status === undefined) {
          return;
        }
        if (data.error || data.status !== 0) {
          data.message = '(' + data.status + ') ' + data.message;
          if (data.status === 1005 || data.status === 1006) {
            data.message = '您没有执行此操作的权限: ' + data.message;
          }
          if (target.failed) {
            data.message = '<br/>' + data.message + '<br/>';
            target.failed(data.status, data.message);
          } else {
            this.handleError(data);
          }
        } else {
          target.success(data);
        }
      } finally {
        if (target.finally) {
          target.finally();
        }
      }
    });
  }

  getUploadUrl() {
    return environment.SERVER.url + this.appendToken('/v1/platform/oss/upload');
  }

  getRepositoryOfOptionData(url): Observable<string[]> {
    url = this.appendToken(url);
    return this.http.post(environment.SERVER.url + url, {}).pipe(
      map((resp: any) => {
        const arr = [];
        const list = resp.data;
        if (list && list.length) {
          list.forEach(element => {
            arr.push({ label: element.label, value: element.value });
          });
        }
        return arr;
      }),
    );
  }

  getRepositoryOfTreeOptionData(url): Observable<string[]> {
    url = this.appendToken(url);
    return this.http.post(environment.SERVER.url + url, {}).pipe(
      map((resp: any) => {
        const arr = [];
        const list = resp.data;
        if (list && list.length) {
          list.forEach(element => {
            arr.push({ label: element.label, value: element.value, parent: element.parent });
          });
        }
        return arr;
      }),
    );
  }

  download(url, args = {}, target: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    url = this.appendToken(url);
    return this.http
      .post(environment.SERVER.url + url, JSON.stringify(args), { headers, responseType: 'blob', observe: 'response' })
      .subscribe((data: any) => {
        try {
          if (target.success) {
            target.success(data);
          }
        } finally {
          if (target.finally) {
            target.finally();
          }
        }
      });
  }

  postWithoutToken(url, args = {}, target: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    url = this.appendAnonymous(url);
    return this.http.post(environment.SERVER.url + url, JSON.stringify(args), { headers }).subscribe((data: any) => {
      try {
        if (null == data || data.status === undefined) {
          return;
        }
        if (data.error || data.status !== 0) {
          data.message = '(' + data.status + ') ' + data.message;
          if (data.status === 1005 || data.status === 1006) {
            data.message = '您没有执行此操作的权限: ' + data.message;
          }
          if (target.failed) {
            data.message = '<br/>' + data.message + '<br/>';
            target.failed(data.status, data.message);
          } else {
            this.handleError(data);
          }
        } else {
          target.success(data);
        }
      } finally {
        if (target.finally) {
          target.finally();
        }
      }
    });
  }

  handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    if (error.status <= 0) {
      errMsg = '无法与后台服务器通讯';
    }
    this.util.error(errMsg);
  }

  appendToken(url: string) {
    if (url.indexOf('?') < 0) {
      url += '?token=' + this.setting.user.token;
    } else {
      url += '&token=' + this.setting.user.token;
    }
    return url;
  }

  appendAnonymous(url: string) {
    if (url.indexOf('?') < 0) {
      url += '?_allow_anonymous=true';
    } else {
      url += '&_allow_anonymous=true';
    }
    return url;
  }
}

export class Result {
  status: number;
  message: string;
  timestamp: number;
  data: any;
}

export class HttpCallback {
  failed?;
  finally?;
  success = (result: Result) => {};
}
