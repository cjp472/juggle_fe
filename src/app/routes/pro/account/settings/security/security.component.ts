import { Component, ChangeDetectionStrategy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalService } from 'src/app/common/modal.service';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-account-settings-security',
  templateUrl: './security.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsSecurityComponent {
  pwd = {
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  };
  constructor(public msg: NzMessageService, public modalService: ModalService, public httpService: HttpService) {}

  forgotPwd() {
    this.modalService.info('请联系系统管理员修改密码', () => {});
  }

  pwdSave() {
    if (!this.pwd.old_password) {
      return this.msg.error('请输入旧密码');
    }
    if (!this.pwd.new_password) {
      return this.msg.error('请输入新密码');
    }
    if (!this.pwd.confirm_new_password) {
      return this.msg.error('请再次确认密码');
    }
    if (this.pwd.new_password !== this.pwd.confirm_new_password) {
      return this.msg.error('两次输入密码不一样');
    }
    this.httpService.post(
      '/v1/auth/updatePwd',
      {
        oldPassword: this.pwd.old_password,
        newPassword: this.pwd.new_password,
      },
      {
        success: res => {
          this.msg.success('更新密码成功');
        },
      },
    );
  }
}
