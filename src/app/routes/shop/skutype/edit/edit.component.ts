import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-skutype-list-edit',
  templateUrl: './edit.component.html',
})
export class ShopSkutypeListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
    },
    required: ['name'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/shop/shopProductSkuType/create';
    if (this.record.id) {
      url = '/v1/shop/shopProductSkuType/' + this.record.id + '/update';
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
