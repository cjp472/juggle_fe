import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-groupmsg-list-edit',
  templateUrl: './edit.component.html',
})
export class GroupmsgListEditComponent {
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
      sendTime: {
        type: 'string',
        title: '群发时间',
        format: 'date-time',
      },
    },
    required: ['title', 'content', 'sendTime'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}
  save(value: any) {
    let url = '/v1/business/groupSms/create';
    if (this.record.id) {
      url = '/v1/business/groupSms/' + this.record.id + '/update';
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
