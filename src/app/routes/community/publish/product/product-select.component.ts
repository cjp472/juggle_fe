import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { Router } from '@angular/router';
import { Field } from '@shared/components/filter-form';

@Component({
  selector: 'app-product-list-select',
  templateUrl: './product-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListSelectComponent implements OnInit {
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

  constructor(private cdr: ChangeDetectorRef, private httpService: HttpService, private modal: NzModalRef) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '名称', 'title'));
  }

  setupTable() {
    this.columns = [
      {
        title: '主图',
        type: 'img',
        width: 100,
        index: 'pictUrl',
      },
      { title: '名称', index: 'title', width: '50%' },
      { title: '更新时间', index: 'updatedTime', type: 'date', width: 200 },
      {
        title: '操作',
        buttons: [
          {
            text: '选择',
            click: record => this.choice(record),
          },
        ],
      },
    ];
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/taobao/taobaoPopular/search',
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

  choice(record: any) {
    this.modal.close(record);
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
