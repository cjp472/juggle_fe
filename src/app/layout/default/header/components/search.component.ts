import { Component, HostBinding, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpService } from 'src/app/common/http.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'header-search',
  template: `
    <nz-input-group [nzAddOnBeforeIcon]="focus ? 'arrow-down' : 'search'">
      <input
        nz-input
        [(ngModel)]="q"
        (focus)="qFocus()"
        (blur)="qBlur()"
        (keyup.enter)="qEnter()"
        [placeholder]="'搜索：会员、商品、文案等'"
      />
    </nz-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSearchComponent implements AfterViewInit {
  q: string;

  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') return;
    this.searchToggled = true;
    this.focus = true;
    setTimeout(() => this.qIpt.focus(), 300);
  }

  constructor(
    private el: ElementRef,
    private msg: NzMessageService,
    private router: Router,
    private httpService: HttpService,
  ) {}

  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement;
  }

  qFocus() {
    this.focus = true;
  }

  qBlur() {
    this.focus = false;
    this.searchToggled = false;
  }

  qEnter() {
    this.httpService.post(
      '/v1/platform/dashboard/search',
      { keyword: this.q },
      {
        success: result => {
          if (result.data.field) {
            switch (result.data.type) {
              case 'MEMBER':
                this.router.navigate([`/app/member`], { queryParams: { field: result.data.field, keyword: this.q } });
                break;
              case 'TAOBAO_GOODS':
                this.router.navigate([`/taobao/goods/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'TAOBAO_PRODUCT':
                this.router.navigate([`/taobao/product/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'TAOBAO_SELECTION':
                this.router.navigate([`/taobao/selection/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'TAOBAO_FAVOURABLE':
                this.router.navigate([`/taobao/favourable/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'TAOBAO_FLASH':
                this.router.navigate([`/taobao/flash/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'TAOBAO_POPULAR':
                this.router.navigate([`/taobao/popular/list`], {
                  queryParams: { field: result.data.field, keyword: this.q },
                });
                break;
              case 'SHOP_PRODUCT':
                this.router.navigate([`/shop/product`], { queryParams: { field: result.data.field, keyword: this.q } });
                break;
              case 'ARTICLE':
                this.router.navigate([`/cms/article`], { queryParams: { field: result.data.field, keyword: this.q } });
                break;
            }
          } else {
            this.msg.info('找不到结果');
          }
        },
      },
    );
  }
}
