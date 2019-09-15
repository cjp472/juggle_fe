import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { UserListEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
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
    private modal: ModalHelper,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '登录名', 'loginName'));
    this.filters.push(new Field('input', '姓名', 'realName'));
    this.filters.push(new Field('input', '手机号', 'mobile'));
    this.filters.push(new Field('input', '邮箱', 'email'));
    this.filters.push(
      new Field('select', '状态', 'status', [{ label: '正常', value: 'NORMAL' }, { label: '禁用', value: 'FORBID' }]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '登录名', index: 'loginName' },
      { title: '姓名', index: 'realName' },
      { title: '手机号', index: 'mobile' },
      { title: '邮箱', index: 'email' },
      { title: '组织', index: 'organziation.name' },
      { title: '角色', index: 'position.name' },
      {
        title: '状态',
        index: 'status',
        type: 'badge',
        badge: {
          NORMAL: { text: '正常', color: 'processing' },
          FORBID: { text: '禁用', color: 'error' },
        },
      },
      { title: '创建时间', index: 'createdTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '编辑',
            click: (item: any) => this.openEdit(item),
          },
          {
            text: (item: any) => (item.status === 'NORMAL' ? '禁用' : '恢复'),
            click: (item: any) => this.changeStatus(item),
          },
          {
            text: '删除',
            click: (item: any) => this.remove(item),
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/system/user/search',
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

  openEdit(record: any = {}) {
    this.modal.create(UserListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      if (record.id) {
        this.getData(this.st.pi);
      } else {
        this.data.splice(0, 0, res);
        this.data = [...this.data];
      }
      this.cdr.detectChanges();
    });
  }

  remove(item: any) {
    this.modalService.showDeleteConfirm('确定要删除吗?', () => {
      this.httpService.post(
        '/v1/system/user/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.msg.success('删除成功');
            this.reset();
          },
        },
      );
    });
  }

  changeStatus(item: any) {
    let content = '确定要禁用该用户吗?';
    let url = '/v1/system/user/' + item.id + '/forbid';
    if (item.status === 'FORBID') {
      content = '确定要恢复该用户吗?';
      url = '/v1/system/user/' + item.id + '/normal';
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

  batchRemove() {
    this.modalService.showDeleteConfirm('确定要批量删除吗?', () => {
      const ids: Array<number> = [];
      this.selectedRows.forEach(row => {
        ids.push(row.id);
      });
      this.httpService.post('/v1/system/user/remove', ids, {
        success: res => {
          this.msg.success('批量删除成功');
          this.reset();
        },
      });
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
