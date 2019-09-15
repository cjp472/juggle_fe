import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-user-list-edit',
  templateUrl: './edit.component.html',
})
export class UserListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      avatar: {
        type: 'string',
        title: '头像',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
        },
      },
      loginName: { type: 'string', title: '登录名', maxLength: 50 },
      realName: { type: 'string', title: '姓名', maxLength: 50 },
      mobile: { type: 'string', title: '手机' },
      email: { type: 'string', title: '邮箱' },
      chains: {
        type: 'number',
        title: '组织',
        ui: {
          widget: 'cascader',
          changeOnSelect: true,
          allowClear: true,
          asyncData: (node, index) => {
            return new Promise(resolve => {
              setTimeout(() => {
                this.httpService
                  .getRepositoryOfTreeOptionData('/v1/system/organization/searchTreeSelect')
                  .subscribe(res => {
                    (node as any).children = res.filter((w: any) => {
                      w.isLeaf = index === 1;
                      return w.parent === (node.value || 0);
                    });
                    resolve();
                  });
              });
            });
          },
        },
        default: this.record.chains ? this.record.chains : [],
      },
      positionId: {
        type: 'string',
        title: '角色',
        ui: {
          widget: 'select',
          asyncData: () => this.httpService.getRepositoryOfOptionData('/v1/system/position/readAllEnabled'),
        },
      },
      detail: {
        type: 'string',
        title: '个人简介',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      address: { type: 'string', title: '街道地址' },
      status: {
        type: 'string',
        title: '状态',
        enum: [{ label: '正常', value: 'NORMAL' }, { label: '禁用', value: 'FORBID' }],
        default: 'NORMAL',
        ui: {
          widget: 'select',
        },
      },
    },
    required: ['loginName', 'realName', 'mobile', 'email', 'status'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/system/user/create';
    if (this.record.id) {
      url = '/v1/system/user/' + this.record.id + '/update';
    }
    value.avatar = value.avatar ? value.avatar[0] : this.record.avatar;
    if (value.chains) {
      value.organizationId = value.chains[value.chains.length - 1];
    }
    this.httpService.post(url, value, {
      success: res => {
        this.msgSrv.success('保存成功');
        this.modal.close(res.data);
      },
    });
  }

  close() {
    this.modal.destroy();
  }
}
