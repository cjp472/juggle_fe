import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { ArticleListEditComponent } from './edit/edit.component';
import { Lightbox, IAlbum } from 'ngx-lightbox';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnInit {
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
  album: Array<IAlbum> = [];

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private modalService: ModalService,
    private modal: ModalHelper,
    private utilService: UtilService,
    private lightbox: Lightbox,
  ) {}

  ngOnInit() {
    this.setupFilters();
    this.setupTable();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '标题', 'title'));
    this.filters.push(new Field('input', '简介', 'brief'));
    this.filters.push(new Field('input', '编码', 'code'));
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
      { title: '编码', index: 'code' },
      { title: '图片', index: 'thumbnail', render: 'thumbnail' },
      { title: '标题', index: 'title' },
      { title: '简介', index: 'brief' },
      { title: '排序', index: 'sort' },
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
      '/v1/cms/article/search',
      { page: pi - 1, size: 10, filters: this.filterHandel(this.filters) },
      {
        success: res => {
          this.data = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
          this.album = [];
          this.data.map(item => {
            this.album.push({ caption: item.title, src: item.thumbnail, thumb: item.thumbnail });
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
    this.modal.create(ArticleListEditComponent, { record }, { size: 'lg' }).subscribe(res => {
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
        '/v1/cms/article/' + item.id + '/remove',
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
