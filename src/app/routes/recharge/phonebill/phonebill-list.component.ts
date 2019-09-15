import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';

@Component({
  selector: 'app-phonebill-list',
  templateUrl: './phonebill-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonebillListComponent implements OnInit {
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
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(
      new Field('input', '充值手机', 'mobile'),
      new Field('select', '充值方式', 'payWay', [
        { label: '支付宝', value: 'ALIPAY' },
        { label: '微信支付', value: 'WXPAY' },
      ]),
      new Field('select', '充值状态', 'status', [
        { label: '待充值', value: 'WAIT' },
        { label: '已充值', value: 'COMPLETE' },
      ]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '会员昵称', index: 'member.nickName' },
      { title: '会员手机', index: 'member.mobile' },
      { title: '充值手机', index: 'mobile' },
      { title: '充值面额', index: 'denomination' },
      { title: '付款金额', index: 'amount' },
      {
        title: '充值状态',
        index: 'status',
        type: 'badge',
        badge: {
          WAIT: { text: '待充值', color: 'processing' },
          COMPLETE: { text: '已充值', color: 'success' },
        },
      },
      { title: '更新时间', index: 'updatedTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '充值',
            click: (item: any) => this.recharge(item),
            iif: record => record.status === 'WAIT',
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/recharge/phoneBill/search',
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

  recharge(item: any) {
    this.modalService.showDeleteConfirm('确定要充值吗?', () => {
      this.httpService.post(
        '/v1/recharge/phoneBill/recharge/' + item.id,
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.reset();
          },
        },
      );
    });
  }

  filterHandel(filters: Array<Field>) {
    const handels: Array<any> = [{ name: 'status', op: '<>', value: 'OPEN' }];
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
