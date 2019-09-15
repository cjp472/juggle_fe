import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLogListComponent implements OnInit {
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
      new Field('select', '状态', 'status', [
        { label: '新建', value: 'NEW' },
        { label: '成功', value: 'SUCCESS' },
        { label: '失败', value: 'FAIL' },
      ]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '名称', index: 'task.name', width: 125 },
      { title: '开始时间', index: 'startTime', type: 'date', width: 200 },
      { title: '结束时间', index: 'endTime', type: 'date', width: 200 },
      {
        title: '状态',
        index: 'status',
        type: 'badge',
        width: 125,
        badge: {
          NEW: { text: '新建', color: 'processing' },
          SUCCESS: { text: '成功', color: 'success' },
          FAIL: { text: '失败', color: 'error' },
        },
      },
      { title: '错误信息', index: 'exception', default: '无' },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/log/scheduleLog/search',
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
