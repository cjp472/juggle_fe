import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-coupon-list-edit',
  templateUrl: './edit.component.html',
})
export class ShopCouponListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 50 },
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      satisfyAmount: {
        type: 'number',
        title: '满',
      },
      reductionAmount: {
        type: 'number',
        title: '减',
      },
      startTime: {
        type: 'string',
        title: '开始时间',
        format: 'date-time',
      },
      endTime: {
        type: 'string',
        title: '结束时间',
        format: 'date-time',
      },
      count: {
        type: 'number',
        title: '数量',
        default: 0,
      },
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
    required: ['name', 'detail', 'satisfyAmount', 'reductionAmount', 'startTime', 'endTime', 'count', 'status'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/shop/shopCoupon/create';
    if (this.record.id) {
      url = '/v1/shop/shopCoupon/' + this.record.id + '/update';
    }
    value.type = 'REACH';
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
