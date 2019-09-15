import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-type-list-edit',
  templateUrl: './edit.component.html',
})
export class TaobaoTypeListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      chains: {
        type: 'number',
        title: '上级类型',
        ui: {
          widget: 'cascader',
          changeOnSelect: true,
          allowClear: true,
          asyncData: (node, index) => {
            return new Promise(resolve => {
              setTimeout(() => {
                this.httpService
                  .getRepositoryOfTreeOptionData('/v1/taobao/taobaoType/searchTreeSelect')
                  .subscribe(res => {
                    (node as any).children = res.filter((w: any) => {
                      w.isLeaf = index === 1;
                      return w.parent === (node.value || 0);
                    });
                    resolve();
                  });
              });
            });
          },
        },
        default: this.record.chains ? this.record.chains : [],
      },
      name: { type: 'string', title: '名称', maxLength: 50 },
      thumbnail: {
        type: 'string',
        title: '图标',
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
    let url = '/v1/taobao/taobaoType/create';
    if (this.record.id) {
      url = '/v1/taobao/taobaoType/' + this.record.id + '/update';
    }
    value.thumbnail = value.thumbnail ? value.thumbnail[0] : this.record.thumbnail;
    if (value.chains) {
      value.parentId = value.chains[value.chains.length - 1];
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
