import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-article-list-edit',
  templateUrl: './edit.component.html',
})
export class ArticleListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      code: { type: 'string', title: '编码', maxLength: 50 },
      title: { type: 'string', title: '标题' },
      brief: {
        type: 'string',
        title: '简介',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
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
      content: {
        type: 'string',
        title: '内容',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 6, maxRows: 24 },
        },
      },
      sort: {
        type: 'number',
        title: '排序',
        default: 0,
      },
    },
    required: ['title', 'brief', 'sort'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  save(value: any) {
    let url = '/v1/cms/article/create';
    if (this.record.id) {
      url = '/v1/cms/article/' + this.record.id + '/update';
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
