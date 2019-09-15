import { Component } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-unit-list-edit',
  templateUrl: './edit.component.html',
})
export class UnitListEditComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      chains: {
        type: 'number',
        title: '上级机构',
        ui: {
          widget: 'cascader',
          changeOnSelect: true,
          allowClear: true,
          asyncData: (node, index) => {
            return new Promise(resolve => {
              setTimeout(() => {
                this.httpService
                  .getRepositoryOfTreeOptionData('/v1/system/organization/searchTreeSelect')
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
      name: { type: 'string', title: '组织名', maxLength: 50 },
      detail: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
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
    let url = '/v1/system/organization/create';
    if (this.record.id) {
      url = '/v1/system/organization/' + this.record.id + '/update';
    }
    if (value.chains.length > 0) {
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
