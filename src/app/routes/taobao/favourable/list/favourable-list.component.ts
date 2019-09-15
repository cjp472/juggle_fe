import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/common/http.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'app-favourable-list',
  templateUrl: './favourable-list.component.html',
  styleUrls: ['./favourable-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaobaoFavourableListComponent {
  _type: any;
  @Input() set type(type) {
    if (type !== this._type) {
      this._type = type;
      this.getData();
    }
  }
  pageNo = 1;

  q: any = {
    ps: 8,
    categories: [],
    title: null,
    sort: null,
    coupon: null,
  };

  list: any[] = [];

  total = 0;

  loading = true;

  categories = [{ id: 0, text: '全部', value: false }];

  album: Array<IAlbum>;

  changeCategory(status: boolean, idx: number) {
    if (idx === 0) {
      this.categories.map(i => (i.value = status));
    } else {
      this.categories[idx].value = status;
    }
  }

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private lightbox: Lightbox,
  ) {}

  stChange() {
    this.getData(this.pageNo);
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/taobao/taobaoFavourable/search',
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
    if (this._type !== 0) {
      handels.push({ name: 'type', value: this._type });
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
