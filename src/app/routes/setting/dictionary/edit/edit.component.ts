import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-dictionary-list-edit',
  templateUrl: './edit.component.html',
})
export class DictionaryListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      type: {
        type: 'string',
        title: '类型',
        enum: [
          { label: '内容变量', value: 'CMS' },
          { label: '系统变量', value: 'SYSTEM' },
          { label: '淘宝客', value: 'TAOBAO' },
          { label: '订单侠', value: 'DINGDANXIA' },
          { label: 'OSS存储', value: 'OSS' },
          { label: 'SMS短信', value: 'SMS' },
          { label: '微信支付', value: 'WXPAY' },
          { label: '支付宝', value: 'ALIPAY' },
          { label: '快递查询', value: 'EXPRESS' },
        ],
        ui: {
          widget: 'select',
        },
      },
      dictKey: { type: 'string', title: '配置名', maxLength: 50 },
      dictValue: { type: 'string', title: '配置值' },
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
    },
    required: ['type', 'dictKey', 'dictValue', 'detail'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/setting/dictionary/create';
    if (this.record.id) {
      url = '/v1/setting/dictionary/' + this.record.id + '/update';
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
