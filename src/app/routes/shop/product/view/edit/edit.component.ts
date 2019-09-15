import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-sku-list-edit',
  templateUrl: './edit.component.html',
})
export class ShopProductSkuListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      typeId: {
        type: 'string',
        title: '类型',
        ui: {
          widget: 'select',
          asyncData: () => this.httpService.getRepositoryOfOptionData('/v1/shop/shopProductSkuType/readAll'),
        },
      },
      name: { type: 'string', title: '规格名称', maxLength: 50 },
      enabled: { type: 'boolean', title: '启用' },
    },
    required: ['typeId', 'name'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/shop/shopProductSku/create';
    if (this.record.id) {
      url = '/v1/shop/shopProductSku/' + this.record.id + '/update';
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
