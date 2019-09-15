import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-tag-list-edit',
  templateUrl: './edit.component.html',
})
export class ShopTagListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码' },
      name: { type: 'string', title: '名称' },
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
      theme: {
        type: 'string',
        format: 'color',
        title: '颜色',
      },
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
    let url = '/v1/shop/shopTag/create';
    if (this.record.id) {
      url = '/v1/shop/shopTag/' + this.record.id + '/update';
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
