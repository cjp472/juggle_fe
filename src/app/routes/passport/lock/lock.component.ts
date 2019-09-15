import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpService } from 'src/app/common/http.service';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'passport-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.less'],
})
export class UserLockComponent {
  f: FormGroup;
  token: string;
  constructor(
    fb: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public settings: SettingsService,
    private router: Router,
    private httpService: HttpService,
    private util: UtilService,
  ) {
    this.token = tokenService.get().token;
    tokenService.clear();
    this.f = fb.group({
      password: [null, Validators.required],
    });
  }

  submit() {
    // tslint:disable-next-line:forin
    for (const i in this.f.controls) {
      this.f.controls[i].markAsDirty();
      this.f.controls[i].updateValueAndValidity();
    }
    if (this.f.valid) {
      console.log('Valid!');
      this.tokenService.set({
        token: this.token,
      });
      this.httpService.post('/v1/auth/checkPwd', this.f.value, {
        success: res => {
          this.router.navigate(['dashboard']);
        },
        failed: (status, message) => {
          this.util.error('(' + status + ')用户密码错误');
          this.tokenService.clear();
        },
      });
    }
  }
}
