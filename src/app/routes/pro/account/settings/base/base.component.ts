import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingService, User } from 'src/app/common/setting.service';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private setting: SettingService,
    private httpService: HttpService,
  ) {}
  avatar = '';
  userLoading = true;
  user: any;
  profile: User;

  ngOnInit(): void {
    zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(([user, province]: any) => {
      this.userLoading = false;
      this.user = user;
      this.profile = this.setting.user;
      this.cdr.detectChanges();
    });
  }

  changeAvatar(info: any) {
    if (info.type === 'success') {
      this.profile.avatar = info.file.response.data[0];
    }
  }

  save() {
    this.httpService.post('/v1/system/user/' + this.profile.id + '/update', this.profile, {
      success: res => {
        this.setting.updateProfile(this.profile);
        this.msg.success('更新用户信息成功');
        return false;
      },
    });
  }
}
