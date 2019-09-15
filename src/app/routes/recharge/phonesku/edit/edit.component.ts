import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-phonesku-list-edit',
  templateUrl: './edit.component.html',
})
export class PhoneskuEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      denomination: { type: 'number', title: '面额' },
      price: { type: 'number', title: '价格' },
      sort: { type: 'number', title: '排序', default: 0 },
      enabled: { type: 'boolean', title: '启用' },
    },
    required: ['name'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/recharge/phoneSku/create';
    if (this.record.id) {
      url = '/v1/recharge/phoneSku/' + this.record.id + '/update';
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
