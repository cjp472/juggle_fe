import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopOrderListComponent implements OnInit {
  @ViewChild('st', { static: true })
  st: STComponent;

  data: any[] = [];
  total = 0;
  loading = false;
  columns: STColumn[];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;
  filters: Array<Field> = [];

  constructor(
    public msg: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '订单号', 'code'));
    this.filters.push(
      new Field('select', '订单状态', 'status', [
        { label: '待付款', value: 'OPEN' },
        { label: '待发货', value: 'PAID' },
        { label: '待收货', value: 'SHIPPED' },
        { label: '待评价', value: 'RECEIVED' },
        { label: '已完成', value: 'COMPLETE' },
        { label: '已取消', value: 'CANCEL' },
      ]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
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

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/shop/shopOrder/search',
      { page: pi - 1, size: 10, filters: this.filterHandel(this.filters) },
      {
        success: res => {
          this.data = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
          this.cdr.detectChanges();
        },
      },
    );
  }

  openView(record: any = {}) {
    this.router.navigateByUrl(`/shop/order/${record.id}`);
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.getData(e.pi);
        break;
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  filterHandel(filters: Array<Field>) {
    const handels: Array<any> = [{ name: 'status', op: '<>', value: 'CLOSED' }];
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null) {
        if (filter.type === 'input') {
          handels.push({ name: filter.name, op: '*', value: filter.value });
        } else {
          handels.push({ name: filter.name, value: filter.value });
        }
      }
    });
    return handels;
  }

  reset() {
    setTimeout(() => this.getData());
  }
}
