import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'header-task',
  template: `
    <div
      class="alain-default__nav-item"
      nz-dropdown
      [nzDropdownMenu]="taskMenu"
      nzTrigger="click"
      nzPlacement="bottomRight"
      (nzVisibleChange)="change()"
    >
      <nz-badge [nzDot]="dot">
        <i nz-icon nzType="bell" class="alain-default__nav-item-icon"></i>
      </nz-badge>
    </div>
    <nz-dropdown-menu #taskMenu="nzDropdownMenu">
      <div nz-menu class="wd-lg">
        <div *ngIf="loading" class="mx-lg p-lg"><nz-spin></nz-spin></div>
        <nz-card *ngIf="!loading" nzTitle="发货通知" nzBordered="false" class="ant-card__body-nopadding">
          <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
          <div
            *ngFor="let order of orders"
            nz-row
            [nzType]="'flex'"
            [nzJustify]="'center'"
            [nzAlign]="'middle'"
            class="py-sm bg-grey-lighter-h point"
            style="width:461px;height:79px;"
            (click)="openOrder(order.id)"
          >
            <div nz-col [nzSpan]="4" class="text-center">
              <nz-avatar
                [nzSrc]="order.member.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'"
              ></nz-avatar>
            </div>
            <div nz-col [nzSpan]="20">
              <strong>{{ order.member.nickName }}</strong>
              <p class="mb0" style="font-size:14px;">{{ order.detail }}</p>
              <p style="color:#CCCCCC;font-size:11px;">{{ order.updatedTime | _date }}</p>
            </div>
          </div>
          <div *ngIf="!dot" nz-row style="width:461px;height:139px;">
            <nz-empty [nzNotFoundContent]="contentTpl" style="margin-top:15px;"></nz-empty>
            <ng-template #contentTpl></ng-template>
          </div>
          <div nz-row>
            <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point" (click)="seeAll()">
              See All
            </div>
          </div>
        </nz-card>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderTaskComponent implements OnInit, OnDestroy {
  loading = true;
  dot = false;
  orders = [];
  timer;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private httpService: HttpService) {}

  ngOnInit() {
    this.getOrderNotices();
    this.timer = setInterval(() => {
      this.getOrderNotices();
    }, 300000);
  }

  getOrderNotices() {
    this.httpService.post(
      '/v1/platform/notice/orderNotices',
      {},
      {
        success: res => {
          this.orders = res.data;
          this.orders.map(order => {
            order.detail = '订单号[' + order.code + ']已付款，待发货';
          });
          this.orders.length > 0 ? (this.dot = true) : (this.dot = false);
          this.cdr.detectChanges();
        },
      },
    );
  }

  openOrder(id) {
    this.router.navigateByUrl(`/shop/order/${id}`);
  }

  change() {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  seeAll() {
    this.router.navigateByUrl(`/shop/order`);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
