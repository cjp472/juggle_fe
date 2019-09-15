import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-interval-list-edit',
  templateUrl: './edit.component.html',
})
export class TaskIntervalListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '任务名称', maxLength: 50 },
      detail: {
        type: 'string',
        title: '任务描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      taskInterval: { type: 'number', title: '任务间隔' },
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
    value.type = 'INTERVAL';
    this.httpService.post('/v1/schedule/scheduleTask/' + this.record.id + '/update', value, {
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
