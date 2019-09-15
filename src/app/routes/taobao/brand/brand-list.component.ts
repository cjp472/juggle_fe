import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { TaobaoBrandListEditComponent } from './edit/edit.component';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaobaoBrandListComponent implements OnInit {
  q: any = {
    status: 'all',
    categoryId: null,
  };
  summary: any = {
    taobaoTypeNum: 0,
    taobaoBrandNum: 0,
    taobaoProductNum: 0,
  };
  loading = false;
  total = 0;
  data: any[] = [];
  taobaoTypeOpts: [any];
  pageNo = 1;
  album: Array<IAlbum> = [];

  constructor(
    private msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modalService: ModalService,
    private lightbox: Lightbox,
  ) {}

  ngOnInit() {
    this.getData();
    this.setupSummary();
    this.setupFilter();
  }

  stChange() {
    this.getData(this.pageNo);
  }

  getData(pi = 1) {
    this.loading = true;
    this.httpService.post(
      '/v1/taobao/taobaoBrand/search',
      { page: pi - 1, size: 10, filters: this.filterHandel() },
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

  setupSummary() {
    this.httpService.post(
      '/v1/taobao/taobaoProduct/summary',
      {},
      {
        success: res => {
          this.summary = res.data;
        },
      },
    );
  }

  setupFilter() {
    this.httpService.post(
      '/v1/taobao/taobaoCategory/readAllEnabled',
      {},
      {
        success: res => {
          this.taobaoTypeOpts = res.data;
          this.cdr.detectChanges();
        },
      },
    );
  }

  openEdit(record: any = {}) {
    this.modal.create(TaobaoBrandListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      if (record.id) {
        record = { ...record, id: 'mock_id', percent: 0, ...res };
      } else {
        this.data.splice(0, 0, res);
        this.data = [...this.data];
      }
      this.cdr.detectChanges();
    });
  }

  sync(record: any) {
    this.modalService.showDeleteConfirm('确定要重新同步品牌商品数据吗?', () => {
      this.httpService.post(
        '/v1/taobao/taobaoBrand/' + record.id + '/sync',
        {},
        {
          success: res => {
            this.msg.success('同步成功');
            this.getData();
          },
        },
      );
    });
  }

  changeEnabled(item: any) {
    let content = '确定要禁用该淘宝品牌吗?';
    let url = '/v1/taobao/taobaoBrand/' + item.id + '/disable';
    if (!item.enabled) {
      content = '确定要启用该淘宝品牌吗?';
      url = '/v1/taobao/taobaoBrand/' + item.id + '/enable';
    }
    this.modalService.showDeleteConfirm(content, () => {
      this.httpService.post(
        url,
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.getData();
          },
        },
      );
    });
  }

  filterHandel() {
    const handels: Array<any> = [];
    if (this.q.status === 'normal') {
      handels.push({ name: 'enabled', value: true });
    } else if (this.q.status === 'forbid') {
      handels.push({ name: 'enabled', value: false });
    }
    if (this.q.categoryId) {
      handels.push({ name: 'categoryId', value: this.q.categoryId });
    }
    return handels;
  }

  remove(item: any) {
    this.modalService.showDeleteConfirm('确定要删除吗?', () => {
      this.httpService.post(
        '/v1/taobao/taobaoBrand/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.getData();
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
}
