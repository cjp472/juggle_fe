import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, ReuseTabService } from '@delon/abc';
import { UtilService } from 'src/app/common/util.service';
import { HttpService } from 'src/app/common/http.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/common/modal.service';
import { ShopProductSkuListEditComponent } from './edit/edit.component';
import { IAlbum, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-product-basic',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductViewComponent {
  @ViewChild('st', { static: true })
  st: STComponent;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private util: UtilService,
    private httpService: HttpService,
    private modalService: ModalService,
    private msg: NzMessageService,
    private modal: ModalHelper,
    private lightbox: Lightbox,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '商品详情';
    this.id = this.util.getParam(this.route, 'id');
    this.setupData();
    this.setupSku();
    this.setupComment();
  }
  id: number;
  data: any = {};
  basicNum = 0;
  amountNum = 0;
  skus = [];
  skusColumns: STColumn[] = [
    { title: '规格类型', index: 'type.name', width: '15%' },
    { title: '规格名称', index: 'name', width: '45%' },
    { title: '启用', index: 'enabled', type: 'yn', width: '25%' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          click: (item: any) => this.openEdit(item),
        },
        {
          text: '删除',
          click: (item: any) => this.remove(item),
        },
      ],
    },
  ];
  comments = [];
  commentsColumns: STColumn[] = [
    {
      title: '头像',
      type: 'img',
      width: 100,
      index: 'avatar',
      default: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    },
    { title: '会员昵称', index: 'nickName' },
    { title: '综合星级', index: 'cStar', render: 'cStar'},
    { title: '评论内容', index: 'content',width:"40%"},
    { title: '创建时间', index: 'createdTime', type: 'date' },
  ];
  commentTotal = 0;
  album: Array<IAlbum> = [];

  setupData() {
    this.httpService.post(
      '/v1/shop/shopProduct/' + this.id + '/read',
      {},
      {
        success: res => {
          this.data = res.data;
          this.album.push({ caption: this.data.name, src: this.data.thumbnail, thumb: this.data.thumbnail });
          if (this.data.slides) {
            this.data.slides = this.data.slides.split(',');
            this.data.slides.forEach(slide => {
              this.album.push({ caption: this.data.name, src: slide, thumb: slide });
            });
          }
          if (this.data.details) {
            this.data.details = this.data.details.split(',');
            this.data.details.forEach(detail => {
              this.album.push({ caption: this.data.name, src: detail, thumb: detail });
            });
          }
          this.album.push({ caption: this.data.name, src: this.data.thumbnail, thumb: this.data.thumbnail });
        },
      },
    );
  }

  setupSku() {
    this.httpService.post(
      '/v1/shop/shopProductSku/search',
      {
        page: 0,
        size: 99,
        filters: [{ name: 'productId', value: this.id }],
      },
      {
        success: res => {
          this.skus = res.data.rows;
          this.cdr.detectChanges();
        },
      },
    );
  }

  setupComment(pi = 1) {
    this.httpService.post(
      '/v1/shop/shopProductComment/search',
      { page: pi - 1, size: 5, filters: [{ name: 'productId', value: this.id }] },
      {
        success: res => {
          this.comments = res.data.rows;
          this.commentTotal = res.data.total;
          this.cdr.detectChanges();
        },
      },
    );
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.setupComment(e.pi);
        break;
    }
  }

  openEdit(record: any = { productId: this.data.id }) {
    this.modal.create(ShopProductSkuListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      if (record.id) {
        this.setupSku();
      } else {
        this.skus.splice(0, 0, res);
        this.skus = [...this.skus];
      }
      this.cdr.detectChanges();
    });
  }

  remove(item: any) {
    this.modalService.showDeleteConfirm('确定要删除吗?', () => {
      this.httpService.post(
        '/v1/shop/shopProductSku/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.setupSku();
          },
        },
      );
    });
  }

  open(i) {
    this.lightbox.open(this.album, i);
  }

  close() {
    this.lightbox.close();
  }

  goBack() {
    this.util.goBack();
  }
}
