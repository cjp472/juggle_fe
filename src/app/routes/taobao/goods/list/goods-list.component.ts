import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/common/http.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaobaoGoodsListComponent {
  _typeId: any;
  @Input() set typeId(typeId) {
    if (typeId !== this._typeId) {
      this._typeId = typeId;
      this.setupType(this._typeId);
    }
  }

  pageNo = 1;

  q: any = {
    ps: 8,
    types: [],
    title: null,
    sort: null,
    coupon: null,
  };

  list: any[] = [];

  total = 0;

  loading = true;

  types = [{ id: 0, text: '全部', value: false }];

  album: Array<IAlbum> = [];

  changeType(status: boolean, idx: number) {
    if (idx === 0) {
      this.types.map(i => (i.value = status));
    } else {
      this.types[idx].value = status;
    }
    this.getData();
  }

  constructor(private cdr: ChangeDetectorRef, private httpService: HttpService, private lightbox: Lightbox) {}

  setupType(typeId: number) {
    this.httpService.post(
      '/v1/taobao/taobaoType/readAllEnabled/' + typeId,
      {},
      {
        success: res => {
          res.data.map(record => {
            record.id = record.value;
            record.text = record.label;
            record.value = false;
          });
          res.data.unshift({ id: 0, text: '全部', value: false });
          this.types = res.data;
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
      '/v1/taobao/taobaoGoods/search',
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
    const types = [];
    if (this._typeId !== 0) {
      if (this.types[0].value !== true) {
        this.types.forEach(type => {
          if (type.value === true) {
            types.push(type.id);
          }
        });
        if (types.length > 0) {
          handels.push({ name: 'typeId', op: 'in', value: types });
        }
      }
      if (types.length === 0) {
        this.types.forEach(type => {
          if (type.id !== 0) {
            types.push(type.id);
          }
        });
        handels.push({ name: 'typeId', op: 'in', value: types });
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
