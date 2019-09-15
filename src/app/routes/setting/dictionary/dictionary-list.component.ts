import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { DictionaryListEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryListComponent implements OnInit {
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
    this.filters.push(
      new Field('select', '类型', 'type', [
        { label: '内容变量', value: 'CMS' },
        { label: '系统变量', value: 'SYSTEM' },
        { label: '淘宝客', value: 'TAOBAO' },
        { label: '订单侠', value: 'DINGDANXIA' },
        { label: 'OSS存储', value: 'OSS' },
        { label: 'SMS短信', value: 'SMS' },
        { label: '微信支付', value: 'WXPAY' },
        { label: '支付宝', value: 'ALIPAY' },
        { label: '快递查询', value: 'EXPRESS' },
      ]),
    );
    this.filters.push(new Field('input', '配置名', 'dictKey'));
    this.filters.push(new Field('input', '描述', 'detail'));
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      {
        title: '类型',
        index: 'type',
        type: 'tag',
        tag: {
          CMS: { text: '内容变量', color: 'lime' },
          SYSTEM: { text: '系统变量', color: 'magenta' },
          TAOBAO: { text: '淘宝客', color: 'volcano' },
          DINGDANXIA: { text: '订单侠', color: 'geekblue' },
          OSS: { text: 'OSS存储', color: 'cyan' },
          SMS: { text: 'SMS短信', color: 'orange' },
          WXPAY: { text: '微信支付', color: 'green' },
          ALIPAY: { text: '支付宝', color: 'blue' },
          EXPRESS: { text: '快递查询', color: 'gold' },
        },
      },
      { title: '配置名', index: 'dictKey' },
      { title: '描述', index: 'detail' },
      { title: '创建时间', index: 'createdTime', type: 'date' },
      {
        title: '操作',
        buttons: [
          {
            text: '编辑',
            click: (item: any) => this.openEdit(item),
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
      '/v1/setting/dictionary/search',
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
    this.modal.create(DictionaryListEditComponent, { record }, { size: 'md' }).subscribe(res => {
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
        '/v1/setting/dictionary/' + item.id + '/remove',
        {},
        {
          success: res => {
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
