import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-push-list-edit',
  templateUrl: './edit.component.html',
})
export class PushListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      title: { type: 'string', title: '标题', maxLength: 50 },
      content: {
        type: 'string',
        title: '内容',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      pushTime: {
        type: 'string',
        title: '推送时间',
        format: 'date-time',
      },
    },
    required: ['title', 'content', 'pushTime'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}
  save(value: any) {
    let url = '/v1/business/push/create';
    if (this.record.id) {
      url = '/v1/business/push/' + this.record.id + '/update';
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
