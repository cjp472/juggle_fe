import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TaobaoPopularListComponent } from './list/popular-list.component';
import { UtilService } from 'src/app/common/util.service';

@Component({
  selector: 'app-popular-layout',
  templateUrl: './popular-layout.component.html',
})
export class TaobaoPopularListLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('juggle', { static: true })
  juggle: TaobaoPopularListComponent;

  private router$: Subscription;
  tabs: any[] = [
    {
      key: 0,
      tab: '全部商品',
    },
    {
      key: 'TYPE1',
      tab: '每日上新',
    },
    {
      key: 'TYPE2',
      tab: '九块九包邮',
    },
  ];
  type = 'TYPE1';
  pos = 0;
  title = null;
  constructor(private router: Router, private route: ActivatedRoute, private utilService: UtilService) {}

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
  }

  ngAfterViewInit(): void {
    const field = this.utilService.getQueryParam(this.route, 'field');
    const keyword = this.utilService.getQueryParam(this.route, 'keyword');
    if (field && keyword) {
      this.title = keyword;
      this.search();
    }
  }

  search() {
    this.juggle.q.title = this.title;
    this.juggle.getData();
  }

  to(item: any) {
    this.type = item.key;
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
  }
}
