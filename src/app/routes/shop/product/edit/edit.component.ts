import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-product-list-edit',
  templateUrl: './edit.component.html',
})
export class ShopProductListEditComponent implements OnInit {
  record: any = {};
  schema: SFSchema = {
    properties: {
      chains: {
        type: 'number',
        title: '商品分类',
        ui: {
          widget: 'cascader',
          changeOnSelect: true,
          allowClear: true,
          asyncData: (node, index) => {
            return new Promise(resolve => {
              setTimeout(() => {
                this.httpService.getRepositoryOfTreeOptionData('/v1/shop/shopType/searchTreeSelect').subscribe(res => {
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
      name: { type: 'string', title: '商品名称', maxLength: 50 },
      thumbnail: {
        type: 'string',
        title: '缩略图',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
        },
      },
      slides: {
        type: 'string',
        title: '轮播图',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
          multiple: true,
        },
      },
      details: {
        type: 'string',
        title: '详情图',
        ui: {
          widget: 'upload',
          action: this.httpService.getUploadUrl(),
          resReName: 'data',
          type: 'select',
          multiple: true,
        },
      },
      brief: {
        type: 'string',
        title: '商品简介',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
        },
      },
      price: { type: 'number', title: '原价' },
      actualPrice: { type: 'number', title: '优惠价' },
      volume: { type: 'number', title: '销量', default: 0 },
      tagsArr: {
        type: 'string',
        title: '商品标签',
        ui: {
          widget: 'checkbox',
          span: 8,
          asyncData: () => this.httpService.getRepositoryOfOptionData('/v1/shop/shopTag/readAllEnabled'),
        },
        default: this.record.tagsArr ? this.record.tagsArr : [],
      },
      recommend: { type: 'boolean', title: '推荐' },
      enabled: { type: 'boolean', title: '上架' },
    },
    required: ['chains', 'name', 'brief', 'price', 'volume'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private httpService: HttpService) {}

  ngOnInit() {
    if (this.record.tags) {
      this.record.tagsArr = this.record.tags.split(',').map(tag => Number(tag));
    }
  }

  save(value: any) {
    let url = '/v1/shop/shopProduct/create';
    if (this.record.id) {
      url = '/v1/shop/shopProduct/' + this.record.id + '/update';
    }
    value.thumbnail = value.thumbnail ? value.thumbnail[0] : this.record.thumbnail;
    value.slides = value.slides.length > 0 ? value.slides.join(',') : this.record.slides;
    value.details = value.details.length > 0 ? value.details.join(',') : this.record.details;
    if (value.chains) {
      value.typeId = value.chains[value.chains.length - 1];
    }
    if (value.tagsArr) {
      value.tags = value.tagsArr.join(',');
    }
    this.httpService.post(url, value, {
      success: res => {
        this.msgSrv.success('保存成功');
        this.modal.close(value);
      },
    });
  }

  close() {
    this.modal.destroy();
  }
}
