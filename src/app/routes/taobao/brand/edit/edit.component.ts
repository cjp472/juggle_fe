import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-brand-list-edit',
  templateUrl: './edit.component.html',
})
export class TaobaoBrandListEditComponent implements OnInit {
  record: any = {};
  taobaoTypeOpts: [any];
  schema: SFSchema = {
    properties: {
      categoryId: {
        type: 'string',
        title: '品牌分类',
        ui: {
          widget: 'select',
          asyncData: () => this.httpService.getRepositoryOfOptionData('/v1/taobao/taobaoCategory/readAllEnabled'),
        },
      },
      thumbnail: {
        type: 'string',
        title: '品牌图',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
        },
      },
      name: { type: 'string', title: '品牌名称', maxLength: 50 },
      detail: {
        type: 'string',
        title: '品牌描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      storeName: { type: 'string', title: '门店名称' },
      storeUrl: { type: 'string', title: '门店url' },
      sort: { type: 'integer', title: '排序', default: 0 },
      enabled: {
        type: 'boolean',
        title: '是否启用',
      },
    },
    required: ['categoryId', 'name', 'detail', 'storeName', 'storeUrl', 'sort'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.post(
      '/v1/taobao/taobaoCategory/readAllEnabled',
      {},
      {
        success: res => {
          this.taobaoTypeOpts = res.data;
        },
      },
    );
  }

  save(value: any) {
    let url = '/v1/taobao/taobaoBrand/create';
    if (this.record.id) {
      url = '/v1/taobao/taobaoBrand/' + this.record.id + '/update';
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
