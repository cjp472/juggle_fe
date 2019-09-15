import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/common/http.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'app-flash-list',
  templateUrl: './flash-list.component.html',
  styleUrls: ['./flash-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaobaoFlashListComponent implements OnInit {
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
    title: null,
    sort: null,
    coupon: null,
    top: null,
  };

  list: any[] = [];

  total = 0;

  loading = true;

  switchLoading = false;

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

  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private lightbox: Lightbox,
  ) {}

  ngOnInit() {
    this.setupType();
  }

  stChange() {
    this.getData(this.pageNo);
  }

  getData(pi = 1) {
    this.loading = true;
    let url = '/v1/taobao/taobaoFlash/search/' + this._type;
    if (this._type === 0) {
      url = '/v1/taobao/taobaoFlash/search';
    }
    this.httpService.post(
      url,
      { page: pi - 1, size: 16, filters: this.filterHandel(), sort: this.q.sort },
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

  setupType() {
    this.httpService.post(
      '/v1/taobao/taobaoFlash/readAllRush',
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

  clickSwitch(item): void {
    this.httpService.post(
      '/v1/taobao/taobaoFlash/' + item.id + '/switchTop',
      {},
      {
        success: res => {
          item.top = !item.top;
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
    if (this._type !== 0) {
      if (this.types[0].value !== true) {
        this.types.forEach(type => {
          if (type.value === true) {
            types.push(type.id);
          }
        });
        if (types.length > 0) {
          handels.push({ name: 'rushTime', op: 'in', value: types });
        }
      }
      if (types.length === 0) {
        this.types.forEach(type => {
          if (type.id !== 0) {
            types.push(type.id);
          }
        });
        handels.push({ name: 'rushTime', op: 'in', value: types });
      }
    }
    if (this.q.title) {
      handels.push({ name: 'title', op: '*', value: this.q.title });
    }
    if (this.q.coupon !== null) {
      handels.push({ name: 'couponAmount', op: 'is_null', value: !this.q.coupon });
    }
    if (this.q.top !== null) {
      handels.push({ name: 'top', value: this.q.top });
    }
    return handels;
  }

  sortHandel() {
    return this.q.sort;
  }
}
