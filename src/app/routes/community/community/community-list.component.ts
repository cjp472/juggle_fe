import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { CommunityListEditComponent } from './edit/edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityListComponent implements OnInit {
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
    this.filters.push(new Field('input', '编码', 'code'));
    this.filters.push(new Field('input', '名称', 'name'));
    this.filters.push(
      new Field('select', '启用', 'enabled', [{ label: '是', value: true }, { label: '否', value: false }]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '编码', index: 'code' },
      { title: '名称', index: 'name' },
      { title: '描述', index: 'detail' },
      { title: '今日发布', index: 'extra.todayPublish' },
      { title: '启用', index: 'enabled', type: 'yn' },
      { title: '创建时间', index: 'createdTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '查看',
            click: record => this.openView(record),
          },
          {
            text: record => (record.enabled ? '禁用' : '恢复'),
            click: record => this.changeStatus(record),
          },
          {
            text: '更多',
            children: [
              {
                text: '编辑',
                icon: 'edit',
                click: record => this.openEdit(record),
              },
              {
                text: '删除',
                icon: 'delete',
                click: record => this.remove(record),
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
      '/v1/community/community/search',
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
    this.router.navigateByUrl(`/community/community/${record.id}`);
  }

  openEdit(record: any = {}) {
    this.modal.create(CommunityListEditComponent, { record }, { size: 'md' }).subscribe(res => {
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
        '/v1/community/community/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.reset();
          },
        },
      );
    });
  }

  changeStatus(item: any) {
    let content = '确定要禁用该社区吗?';
    let url = '/v1/community/community/' + item.id + '/disable';
    if (!item.enabled) {
      content = '确定要恢复该社区吗?';
      url = '/v1/community/community/' + item.id + '/enable';
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
