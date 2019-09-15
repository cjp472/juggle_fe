import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-type-list-edit',
  templateUrl: './edit.component.html',
})
export class AdvertTypeListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '类型名称', maxLength: 50 },
      detail: {
        type: 'string',
        title: '类型描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      enabled: {
        type: 'boolean',
        title: '启用',
      },
    },
    required: ['code', 'name', 'detail'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}
  save(value: any) {
    let url = '/v1/advert/advertType/create';
    if (this.record.id) {
      url = '/v1/advert/advertType/' + this.record.id + '/update';
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
