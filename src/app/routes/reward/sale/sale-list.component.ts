import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent implements OnInit {
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

  constructor(public msg: NzMessageService, private cdr: ChangeDetectorRef, private httpService: HttpService) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(
      new Field('select', '奖励类型', 'teamerId', [
        { label: '个人奖励', value: true },
        { label: '团队奖励', value: false },
      ]),
    );
    this.filters.push(
      new Field('select', '状态', 'status', [
        { label: '待结算', value: 'PEND' },
        { label: '已结算', value: 'PAID' },
        { label: '已退货', value: 'REFUND' },
      ]),
    );
  }

  setupTable() {
    this.columns = [
      {
        title: '头像',
        type: 'img',
        width: 100,
        index: 'member.avatar',
        default: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      },
      { title: '会员昵称', index: 'member.nickName' },
      { title: '手机号码', index: 'member.mobile' },
      { title: '奖励类型', render: 'rewardType' },
      { title: '奖励金额', index: 'amount' },
      {
        title: '状态',
        index: 'status',
        type: 'badge',
        badge: {
          PEND: { text: '待结算', color: 'processing' },
          PAID: { text: '已结算', color: 'success' },
          REFUND: { text: '已退货', color: 'error' },
        },
      },
      { title: '创建时间', index: 'createdTime', type: 'date' },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/app/reward/search',
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
    const handels: Array<any> = [{ name: 'type', value: 'SALE' }];
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null) {
        if (filter.type === 'input') {
          handels.push({ name: filter.name, op: '*', value: filter.value });
        } else if (filter.name === 'teamerId') {
          if (filter.value) {
            handels.push({ name: 'teamerId', op: 'is_null', value: true });
          } else {
            handels.push({ name: 'teamerId', op: 'is_null', value: false });
          }
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
