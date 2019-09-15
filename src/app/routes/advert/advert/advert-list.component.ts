import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { AdvertListEditComponent } from './edit/edit.component';
import { IAlbum, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-advert-list',
  templateUrl: './advert-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertListComponent implements OnInit {
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
  advertTypeOpts = [];
  album: Array<IAlbum> = [];

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modalService: ModalService,
    private modal: ModalHelper,
    private lightbox: Lightbox,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.httpService.post(
      '/v1/advert/advertType/readAllEnabled',
      {},
      {
        success: res => {
          this.filters.forEach(filter => {
            if (filter.name === 'typeId') {
              filter.extra = res.data;
            }
          });
          this.cdr.detectChanges();
        },
      },
    );
    this.filters.push(new Field('select', '分类', 'typeId', this.advertTypeOpts));
    this.filters.push(new Field('input', '名称', 'name'));
    this.filters.push(
      new Field('select', '协议', 'protocol', [
        { label: '打开网页', value: 'URL' },
        { label: '打开淘宝', value: 'TAOBAO' },
        { label: '应用接口', value: 'API' },
        { label: '页面定向', value: 'DIRECTION' },
      ]),
    );
    this.filters.push(
      new Field('select', '启用', 'enabled', [{ label: '是', value: true }, { label: '否', value: false }]),
    );
  }

  setupTable() {
    this.columns = [
      { title: '', index: 'key', type: 'checkbox' },
      { title: '图片', index: 'thumbnail', render: 'thumbnail' },
      { title: '名称', index: 'name' },
      {
        title: '协议',
        index: 'protocol',
        type: 'tag',
        tag: {
          URL: { text: '打开网页', color: 'blue' },
          TAOBAO: { text: '打开淘宝', color: 'red' },
          API: { text: '应用接口', color: 'purple' },
          DIRECTION: { text: '页面定向', color: 'cyan' },
        },
      },
      { title: '排序', index: 'sort' },
      { title: '启用', index: 'enabled', type: 'yn' },
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
      '/v1/advert/advert/search',
      { page: pi - 1, size: 10, filters: this.filterHandel(this.filters) },
      {
        success: res => {
          this.data = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
          this.album = [];
          this.data.map(item => {
            this.album.push({ caption: item.name, src: item.thumbnail, thumb: item.thumbnail });
          });
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
    this.modal.create(AdvertListEditComponent, { record }, { size: 'md' }).subscribe(res => {
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
        '/v1/advert/advert/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.reset();
          },
        },
      );
    });
  }

  open(i) {
    this.lightbox.open(this.album, i);
  }

  close() {
    this.lightbox.close();
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
