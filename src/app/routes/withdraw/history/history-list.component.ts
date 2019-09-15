import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawHistoryListComponent implements OnInit {
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
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modal: ModalHelper,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '流水号', 'code'));
    this.filters.push(
      new Field('select', '提现方式', 'accountType', [
        { label: '支付宝', value: 'ALIPAY' },
        { label: '银行卡', value: 'BANK' },
      ]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '流水号', index: 'code', width: 175 },
      { title: '头像', type: 'img', width: 100, index: 'member.avatar' },
      { title: '昵称', index: 'member.nickName' },
      { title: '手机号', index: 'member.mobile' },
      {
        title: '会员等级',
        index: 'member.grade',
        type: 'tag',
        tag: {
          GRADE1: { text: '普通会员', color: 'blue' },
          GRADE2: { text: '黄金会员', color: 'orange' },
        },
      },
      {
        title: '提现方式',
        index: 'accountType',
        type: 'tag',
        tag: {
          ALIPAY: { text: '支付宝', color: 'blue' },
          BANK: { text: '银行卡', color: 'green' },
        },
      },
      { title: '提现金额', index: 'amount', type: 'currency' },
      { title: '打款时间', index: 'updatedTime', type: 'date' },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/app/withdraw/search',
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
    const handels: Array<any> = [{ name: 'status', value: 'PAID' }];
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
