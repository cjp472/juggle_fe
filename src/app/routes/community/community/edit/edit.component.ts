import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-type-list-edit',
  templateUrl: './edit.component.html',
})
export class CommunityListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '社区名称', maxLength: 50 },
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      sort: { type: 'number', title: '排序', default: 0 },
      enabled: {
        type: 'boolean',
        title: '是否启用',
      },
    },
    required: ['name', 'detail'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/community/community/create';
    if (this.record.id) {
      url = '/v1/community/community/' + this.record.id + '/update';
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
