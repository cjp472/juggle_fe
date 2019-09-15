import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, ReuseTabService } from '@delon/abc';
import { UtilService } from 'src/app/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/common/http.service';
import { ShopShipEditComponent } from './ship/ship.component';
import { IAlbum, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-order-advanced',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopOrderAdvancedComponent implements OnInit {
  id: number;
  record: any = {};
  statusNum = 0;
  data = [];
  express;
  columns: STColumn[];
  album: Array<IAlbum> = [];
  selectTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private util: UtilService,
    private httpService: HttpService,
    private modal: ModalHelper,
    private lightbox: Lightbox,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '订单详情';
    this.id = this.util.getParam(route, 'id');
  }

  ngOnInit() {
    this.setupData();
  }

  setupData() {
    this.httpService.post(
      '/v1/shop/shopOrder/' + this.id + '/read',
      {},
      {
        success: res => {
          this.record = res.data;
          this.statusNum = this.statusToNum(res.data.status);
          if (this.record.snapshot.product.details) {
            this.record.snapshot.product.details = this.record.snapshot.product.details.split(',');
            this.record.snapshot.product.details.forEach(detail => {
              this.album.push({ caption: this.record.snapshot.product.name, src: detail, thumb: detail });
            });
          }
          this.setupTable();
          this.setupOrders();
          this.setupExpress();
        },
      },
    );
  }

  setupExpress() {
    this.httpService.post(
      '/v1/shop/shopExpress/getExpress/' + this.id,
      {},
      {
        success: res => {
          if (res.data && res.data.snapshot) {
            this.express = res.data.snapshot;
          }
        },
      },
    );
  }

  setupTable() {
    this.columns = [
      { title: '订单号', index: 'code' },
      { title: '昵称', index: 'member.nickName' },
      { title: '手机号', index: 'member.mobile' },
      { title: '商品名称', index: 'snapshot.product.name' },
      { title: '订单金额', index: 'amount' },
      {
        title: '状态',
        index: 'status',
        type: 'badge',
        badge: {
          OPEN: { text: '待付款', color: 'processing' },
          PAID: { text: '待发货', color: 'warning' },
          SHIPPED: { text: '待收货', color: 'success' },
          RECEIVED: { text: '待评价', color: 'default' },
          COMPLETE: { text: '已完成', color: 'success' },
          CANCEL: { text: '已取消', color: 'error' },
        },
      },
      { title: '创建时间', index: 'createdTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '查看',
            click: (item: any) => this.openView(item),
          },
        ],
      },
    ];
  }

  setupOrders() {
    this.httpService.post(
      '/v1/shop/shopOrder/search',
      {
        page: 0,
        size: 5,
        filters: [
          { name: 'memberId', value: this.record.memberId },
          { name: 'id', op: '<>', value: this.record.id },
          { name: 'status', op: '<>', value: 'CLOSED' },
        ],
      },
      {
        success: res => {
          this.data = res.data.rows;
          this.cdr.detectChanges();
        },
      },
    );
  }

  openView(record: any = {}) {
    this.router.navigateByUrl(`/shop/order/${record.id}`);
  }

  ship(record: any) {
    this.modal.create(ShopShipEditComponent, { record }, { size: 'md' }).subscribe(res => {
      this.record = res;
      this.statusNum = this.statusToNum(res.status);
      this.cdr.detectChanges();
    });
  }

  statusToNum(status: string) {
    let num;
    switch (status) {
      case 'OPEN':
        num = 0;
        break;
      case 'PAID':
        num = 1;
        break;
      case 'SHIPPED':
        num = 2;
        break;
      case 'RECEIVED':
        num = 3;
        break;
      case 'COMPLETE':
        num = 4;
        break;
      default:
        num = 0;
        break;
    }
    return num;
  }

  open(i) {
    this.lightbox.open(this.album, i);
  }

  close() {
    this.lightbox.close();
  }

  selectChange(event) {
    this.selectTab = event.index;
    this.cdr.detectChanges();
  }

  goBack() {
    this.util.goBack();
  }
}
