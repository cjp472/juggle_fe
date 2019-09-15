import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/common/http.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaobaoProductListComponent {
  _categoryId: any;
  @Input() set categoryId(categoryId) {
    if (categoryId !== this._categoryId) {
      this._categoryId = categoryId;
      this.setupBrand(this._categoryId);
    }
  }

  pageNo = 1;

  q: any = {
    ps: 8,
    brands: [],
    title: null,
    sort: null,
    coupon: null,
  };

  list: any[] = [];

  total = 0;

  loading = true;

  brands = [{ id: 0, text: '全部', value: false }];

  album: Array<IAlbum> = [];

  changeBrand(status: boolean, idx: number) {
    if (idx === 0) {
      this.brands.map(i => (i.value = status));
    } else {
      this.brands[idx].value = status;
    }
    this.getData();
  }

  constructor(private cdr: ChangeDetectorRef, private httpService: HttpService, private lightbox: Lightbox) {}

  setupBrand(typeId: number) {
    this.httpService.post(
      '/v1/taobao/taobaoBrand/readAllEnabled/' + typeId,
      {},
      {
        success: res => {
          res.data.map(record => {
            record.id = record.value;
            record.text = record.label;
            record.value = false;
          });
          res.data.unshift({ id: 0, text: '全部', value: false });
          this.brands = res.data;
          this.getData();
        },
      },
    );
  }

  stChange() {
    this.getData(this.pageNo);
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/taobao/taobaoProduct/search',
      { page: pi - 1, size: 16, filters: this.filterHandel(), sort: this.sortHandel() },
      {
        success: res => {
          this.list = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
          this.album = [];
          this.list.map(item => {
            this.album.push({ caption: item.title, src: item.pictUrl, thumb: item.pictUrl });
          });
          this.cdr.detectChanges();
        },
      },
    );
  }

  open(i) {
    this.lightbox.open(this.album, i);
  }

  close() {
    this.lightbox.close();
  }

  filterHandel() {
    const handels: Array<any> = [];
    if (this._categoryId !== 0) {
      handels.push({ name: 'categoryId', value: this._categoryId });
      if (this.brands[0].value !== true) {
        const brands = [];
        this.brands.forEach(brand => {
          if (brand.value === true) {
            brands.push(brand.id);
          }
        });
        if (brands.length > 0) {
          handels.push({ name: 'brandId', op: 'in', value: brands });
        }
      }
    }
    if (this.q.title) {
      handels.push({ name: 'title', op: '*', value: this.q.title });
    }
    if (this.q.coupon !== null) {
      handels.push({ name: 'couponAmount', op: 'is_null', value: !this.q.coupon });
    }
    return handels;
  }

  sortHandel() {
    return this.q.sort;
  }
}
