import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-ship-edit',
  templateUrl: './ship.component.html',
})
export class ShopShipEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      shippedCom: {
        type: 'string',
        title: '快递公司',
        enum: [{ label: '韵达', value: 'YUNDA' }, { label: '中通', value: 'ZTO' }],
        ui: {
          widget: 'select',
        },
      },
      shippedNo: { type: 'string', title: '快递单号' },
    },
    required: ['shippedCom', 'shippedNo'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    this.httpService.post('/v1/shop/shopOrder/ship', value, {
      success: res => {
        this.msgSrv.success('操作成功');
        this.modal.close(res.data);
      },
    });
  }

  close() {
    this.modal.destroy();
  }
}
