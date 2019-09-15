import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { TaskIntervalListEditComponent } from './edit/edit.component';
import { ModalService } from 'src/app/common/modal.service';

@Component({
  selector: 'app-interval-list',
  templateUrl: './interval-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskIntervalListComponent implements OnInit {
  @ViewChild('st', { static: true })
  st: STComponent;
  scroll = { y: '230px' };

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
    this.filters.push(new Field('input', '编码', 'code'));
    this.filters.push(new Field('input', '名称', 'name'));
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '编码', index: 'code' },
      { title: '名称', index: 'name' },
      { title: '间隔', index: 'taskInterval' },
      { title: '最后执行时间', index: 'lastSyncTime', type: 'date' },
      {
        title: '最后执行状态',
        index: 'lastSyncStatus',
        type: 'badge',
        badge: {
          ING: { text: '执行中', color: 'processing' },
          SUCCESS: { text: '已执行', color: 'success' },
          FAIL: { text: '已失败', color: 'error' },
        },
      },
      { title: '启用', index: 'enabled', type: 'yn' },
      {
        title: '操作',
        buttons: [
          {
            text: '编辑',
            click: (item: any) => this.openEdit(item),
          },
          {
            text: '执行',
            click: (item: any) => this.execute(item),
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/schedule/scheduleTask/search',
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
    this.modal.create(TaskIntervalListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      if (record.id) {
        this.getData(this.st.pi);
      } else {
        this.data.splice(0, 0, res);
        this.data = [...this.data];
      }
      this.cdr.detectChanges();
    });
  }

  execute(item: any) {
    this.modalService.showDeleteConfirm('确定要立即执行该任务吗?', () => {
      this.loading = true;
      this.cdr.detectChanges();
      this.httpService.post(
        '/v1/schedule/scheduleTask/' + item.id + '/execute',
        {},
        {
          success: res => {
            this.loading = false;
            this.cdr.detectChanges();
            this.msg.success('执行成功');
            this.reset();
          },
        },
      );
    });
  }

  filterHandel(filters: Array<Field>) {
    const handels: Array<any> = [{ name: 'type', value: 'INTERVAL' }];
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
