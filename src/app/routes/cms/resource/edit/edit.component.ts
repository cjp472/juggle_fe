import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-resource-list-edit',
  templateUrl: './edit.component.html',
})
export class ResourceListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码', maxLength: 50 },
      name: { type: 'string', title: '名称' },
      icon: {
        type: 'string',
        title: '图标',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
        },
      },
      thumbnail: {
        type: 'string',
        title: '图片',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
        },
      },
      protocol: {
        type: 'string',
        title: '协议',
        enum: [
          { label: '打开网页', value: 'URL' },
          { label: '打开淘宝', value: 'TAOBAO' },
          { label: '应用接口', value: 'API' },
          { label: '页面定向', value: 'DIRECTION' },
        ],
        default: 'URL',
        ui: {
          widget: 'select',
        },
      },
      uri: {
        type: 'string',
        title: 'URI',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
      extra: {
        type: 'string',
        title: '额外',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
      sort: {
        type: 'number',
        title: '排序',
        default: 0,
      },
    },
    required: ['name', 'sort'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/cms/resource/create';
    if (this.record.id) {
      url = '/v1/cms/resource/' + this.record.id + '/update';
    }
    value.icon = value.icon ? value.icon[0] : this.record.icon;
    value.thumbnail = value.thumbnail ? value.thumbnail[0] : this.record.thumbnail;
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
