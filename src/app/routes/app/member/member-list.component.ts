import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListComponent implements OnInit {
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
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private utilService: UtilService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '昵称', 'nickName'));
    this.filters.push(new Field('input', '手机号', 'mobile'));
    this.filters.push(
      new Field('select', '会员等级', 'grade', [
        { label: '普通会员', value: 'GRADE1' },
        { label: '黄金会员', value: 'GRADE2' },
      ]),
    );
    this.filters.push(
      new Field('select', '状态', 'status', [{ label: '正常', value: 'NORMAL' }, { label: '禁用', value: 'FORBID' }]),
    );
    this.filters.push(
      new Field('select', '已实名', 'certified', [{ label: '是', value: true }, { label: '否', value: false }]),
    );
    const field = this.utilService.getQueryParam(this.route, 'field');
    const keyword = this.utilService.getQueryParam(this.route, 'keyword');
    if (field && keyword) {
      this.filters.map(filter => {
        if (filter.name === field) {
          filter.value = keyword;
        }
      });
    }
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      {
        title: '头像',
        type: 'img',
        width: 100,
        index: 'avatar',
        default: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      },
      { title: '编码', index: 'code' },
      { title: '昵称', index: 'nickName' },
      { title: '手机号', index: 'mobile' },
      {
        title: '会员等级',
        index: 'grade',
        type: 'tag',
        tag: {
          GRADE1: { text: '普通会员', color: 'blue' },
          GRADE2: { text: '黄金会员', color: 'orange' },
        },
      },
      { title: '已实名', index: 'certified', type: 'yn' },
      {
        title: '状态',
        index: 'status',
        type: 'badge',
        badge: {
          NORMAL: { text: '正常', color: 'processing' },
          FORBID: { text: '禁用', color: 'error' },
        },
      },
      { title: '注册时间', index: 'createdTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '查看',
            click: (item: any) => this.openView(item),
          },
          {
            text: (item: any) => (item.status === 'NORMAL' ? '禁用' : '恢复'),
            click: (item: any) => this.changeStatus(item),
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/app/member/search',
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

  openView(record: any = {}) {
    this.router.navigateByUrl(`/app/member/${record.id}`);
  }

  changeStatus(item: any) {
    let content = '确定要禁用该会员吗?';
    let url = '/v1/app/member/' + item.id + '/forbid';
    if (item.status === 'FORBID') {
      content = '确定要恢复该会员吗?';
      url = '/v1/app/member/' + item.id + '/normal';
    }
    this.modalService.showDeleteConfirm(content, () => {
      this.httpService.post(
        url,
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
    const handels: Array<any> = [];
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
