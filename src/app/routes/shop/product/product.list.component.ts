import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ShopProductListEditComponent } from './edit/edit.component';
import { Field } from '@shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Lightbox, IAlbum } from 'ngx-lightbox';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: [
    `
      :host ::ng-deep .ant-card-meta-title {
        margin-bottom: 12px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductListComponent implements OnInit {
  list: any[] = [null];
  loading = true;
  filters: Array<Field> = [];
  typeIdOpts = [];
  page = 0;
  album: Array<IAlbum> = [];

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalHelper,
    private modalService: ModalService,
    private httpService: HttpService,
    private utilService: UtilService,
    private lightbox: Lightbox,
  ) {}

  ngOnInit() {
    this.httpService.post(
      '/v1/shop/shopType/searchTree',
      {},
      {
        success: res => {
          this.typeIdOpts = res.data;
          this.setupFilters();
          this.getData();
        },
      },
    );
  }

  setupFilters() {
    this.filters.push(new Field('cascader', '分类', 'typeId', this.typeIdOpts));
    this.filters.push(new Field('input', '名称', 'name'));
    this.filters.push(
      new Field('select', '状态', 'enabled', [{ label: '上架', value: true }, { label: '下架', value: false }]),
    );
    this.filters.push(
      new Field('select', '推荐', 'recommend', [{ label: '是', value: true }, { label: '否', value: false }]),
    );
    this.filters.push(
      new Field('select', '排序', 'sort', [
        { label: '价格降序', value: 'actualPrice desc' },
        { label: '价格升序', value: 'actualPrice asc' },
        { label: '销量降序', value: 'volume desc' },
        { label: '销量升序', value: 'volume asc' },
        { label: '奖励降序', value: 'reward desc' },
        { label: '奖励升序', value: 'reward asc' },
      ]),
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

  getData(more = false) {
    this.loading = true;
    if (more === true) {
      this.page++;
    } else {
      this.page = 0;
    }
    this.httpService.post(
      '/v1/shop/shopProduct/search',
      {
        page: this.page,
        size: this.page === 0 ? 8 : 9,
        filters: this.filterHandel(this.filters),
        sort: this.sortHandel(this.filters),
      },
      {
        success: res => {
          this.list = more ? this.list.concat(res.data.rows) : [null].concat(res.data.rows);
          this.loading = false;
          if (!more) {
            this.album = [];
          }
          this.list.map(item => {
            if (item !== null) {
              this.album.push({ caption: item.name, src: item.thumbnail, thumb: item.thumbnail });
            }
          });
          this.cdr.detectChanges();
        },
      },
    );
  }

  openEdit(record: any = {}) {
    this.modal.create(ShopProductListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      this.getData();
    });
  }

  changeEnabled(item: any) {
    let content = '确定要下架该商品吗?';
    let url = '/v1/shop/shopProduct/' + item.id + '/disable';
    if (!item.enabled) {
      content = '确定要上架该商品吗?';
      url = '/v1/shop/shopProduct/' + item.id + '/enable';
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

  remove(item: any) {
    this.modalService.showDeleteConfirm('确定要删除吗?', () => {
      this.httpService.post(
        '/v1/shop/shopProduct/' + item.id + '/remove',
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

  openView(record: any = {}) {
    this.router.navigateByUrl(`/shop/product/${record.id}`);
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
        } else if (filter.name === 'typeId') {
          handels.push({ name: filter.name, value: filter.value[filter.value.length - 1] });
        } else if (filter.name !== 'sort') {
          handels.push({ name: filter.name, value: filter.value });
        }
      }
    });
    return handels;
  }

  sortHandel(filters: Array<Field>) {
    let sort = null;
    filters.map(filter => {
      if (filter.name === 'sort' && filter.value) {
        sort = filter.value;
      }
    });
    return sort;
  }

  reset() {
    setTimeout(() => this.getData());
  }
}
