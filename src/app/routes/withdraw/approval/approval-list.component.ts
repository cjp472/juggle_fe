import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawApprovalListComponent implements OnInit {
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
    private router: Router,
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
      new Field('select', '审批状态', 'processStatus', [
        { label: '待审批', value: 'OPEN' },
        { label: '已通过', value: 'PASS' },
        { label: '已拒绝', value: 'REJECT' },
      ]),
    );
    this.filters.push(new Field('dateRange', '申请时间', 'applyDateRange'));
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '昵称', index: 'member.nickName' },
      { title: '手机号', index: 'member.mobile' },
      {
        title: '提现方式',
        index: 'extra.accountType',
        type: 'tag',
        tag: {
          ALIPAY: { text: '支付宝', color: 'blue' },
          BANK: { text: '银行卡', color: 'green' },
        },
      },
      { title: '提现金额', index: 'extra.amount', type: 'currency' },
      { title: '申请时间', index: 'createdTime', type: 'date' },
      {
        title: '审批状态',
        index: 'processStatus',
        type: 'badge',
        badge: {
          OPEN: { text: '待审批', color: 'processing' },
          PASS: { text: '已通过', color: 'success' },
          REJECT: { text: '已拒绝', color: 'error' },
        },
      },
      { title: '审批人', index: 'approver.realName' },
      { title: '审批时间', index: 'approvalTime', type: 'date' },
      {
        title: '操作',
        width: 100,
        buttons: [
          {
            text: '查看',
            click: (item: any) => this.openView(item),
          },
          {
            text: '更多',
            iif: record => record.processStatus === 'OPEN',
            children: [
              {
                text: '通过',
                icon: 'check',
                click: record => this.pass(record),
              },
              {
                text: '拒绝',
                icon: 'close',
                click: record => this.reject(record),
              },
            ],
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/approval/approval/search',
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

  openView(record: any) {
    this.router.navigateByUrl(`/withdraw/approval/${record.id}`);
  }

  pass(item: any) {
    this.modalService.showDeleteConfirm('确定要审批通过该实名申请吗?', () => {
      this.httpService.post(
        '/v1/approval/approval/' + item.id + '/pass',
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

  reject(item: any) {
    this.modalService.showDeleteConfirm('确定要审批拒绝该实名申请吗?', () => {
      this.httpService.post(
        '/v1/approval/approval/' + item.id + '/reject',
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
    const handels: Array<any> = [{ name: 'processInstanceType', value: 'WITHDRAW' }];
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null) {
        if (filter.type === 'input') {
          handels.push({ name: filter.name, op: '*', value: filter.value });
        } else if (filter.type === 'dateRange') {
          handels.push({ name: 'createdTime', op: '>', value: new Date(filter.value[0]).getTime() });
          handels.push({ name: 'createdTime', op: '<', value: new Date(filter.value[1]).getTime() });
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
