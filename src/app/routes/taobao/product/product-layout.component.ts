import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/common/http.service';
import { TaobaoProductListComponent } from './list/product-list.component';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'app-product-layout',
  templateUrl: './product-layout.component.html',
})
export class TaobaoProductListLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('juggle', { static: true })
  juggle: TaobaoProductListComponent;

  private router$: Subscription;
  tabs: any[] = [{ key: 0, tab: '全部商品' }];
  categoryId = 0;
  pos = 0;
  title = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private utilService: UtilService,
  ) {}

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) {
      this.pos = idx;
    }
  }

  ngOnInit(): void {
    this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
    this.setActive();
    this.setupLayout();
  }

  ngAfterViewInit(): void {
    const field = this.utilService.getQueryParam(this.route, 'field');
    const keyword = this.utilService.getQueryParam(this.route, 'keyword');
    if (field && keyword) {
      this.title = keyword;
      this.search();
    }
  }

  setupLayout() {
    this.httpService.post(
      '/v1/taobao/taobaoCategory/readAllEnabled',
      {},
      {
        success: res => {
          res.data.map(item => {
            item.key = item.value;
            item.tab = item.label;
          });
          this.tabs = this.tabs.concat(res.data);
        },
      },
    );
  }

  search() {
    this.juggle.q.title = this.title;
    this.juggle.getData();
  }

  to(item: any) {
    this.categoryId = item.key;
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
  }
}
