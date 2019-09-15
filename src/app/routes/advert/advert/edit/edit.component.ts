import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-advert-list-edit',
  templateUrl: './edit.component.html',
})
export class AdvertListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      typeId: {
        type: 'string',
        title: '分类',
        ui: {
          widget: 'select',
          asyncData: () => this.httpService.getRepositoryOfOptionData('/v1/advert/advertType/readAllEnabled'),
        },
      },
      name: { type: 'string', title: '名称', maxLength: 50 },
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
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
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
      uri: { type: 'string', title: 'uri' },
      sort: { type: 'number', title: '排序', default: 0 },
      enabled: { type: 'boolean', title: '是否启用' },
    },
    required: ['typeId', 'name', 'detail', 'protocol', 'sort'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}
  save(value: any) {
    let url = '/v1/advert/advert/create';
    if (this.record.id) {
      url = '/v1/advert/advert/' + this.record.id + '/update';
    }
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
