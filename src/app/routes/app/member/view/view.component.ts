import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, ReuseTabService } from '@delon/abc';
import { UtilService } from 'src/app/common/util.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/common/http.service';
import { IAlbum, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-member-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberViewComponent implements OnInit {
  id: number;
  data: any = {};
  withdraw: [any];
  album: Array<IAlbum> = [];
  withdrawColumns: STColumn[] = [
    {
      title: '提现方式',
      index: 'accountType',
      type: 'tag',
      tag: {
        ALIPAY: { text: '支付宝', color: 'blue' },
        BANK: { text: '银行卡', color: 'green' },
      },
    },
    { title: '提现金额', index: 'amount', type: 'currency' },
    { title: '申请时间', index: 'createdTime', type: 'date' },
    { title: '打款时间', index: 'updatedTime', type: 'date' },
  ];
  bank: [any];
  bankColumns: STColumn[] = [
    { title: '持卡人', index: 'name' },
    { title: '银行卡', index: 'bank' },
    { title: '银行卡号', index: 'cardNo' },
    { title: '身份证号', index: 'cardId' },
    { title: '预留手机', index: 'mobile' },
  ];
  address: [any];
  addressColumns: STColumn[] = [
    { title: '收货人', index: 'name' },
    { title: '联系电话', index: 'mobile' },
    { title: '地区', index: 'extra.area' },
    { title: '详细地址', index: 'address' },
    {
      title: '默认',
      index: 'present',
      type: 'badge',
      badge: {
        true: { text: '是', color: 'processing' },
        false: { text: '否', color: 'default' },
      },
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private util: UtilService,
    private httpService: HttpService,
    private lightbox: Lightbox,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '会员详情';
    this.id = this.util.getParam(this.route, 'id');
  }

  ngOnInit() {
    this.httpService.post(
      '/v1/app/member/' + this.id + '/read',
      {},
      {
        success: res => {
          this.data = res.data;
          if (this.data.certified) {
            this.album.push({
              caption: this.data.extra.realName,
              src: this.data.extra.idCardFront,
              thumb: this.data.extra.idCardFront,
            });
            this.album.push({
              caption: this.data.extra.realName,
              src: this.data.extra.idCardBack,
              thumb: this.data.extra.idCardBack,
            });
          }
        },
      },
    );
    this.setupWithdraw();
    this.setupAddress();
    this.setupBank();
  }

  setupWithdraw() {
    this.httpService.post(
      '/v1/app/withdraw/search',
      {
        page: 0,
        size: 10,
        filters: [{ name: 'memberId', value: this.id }],
      },
      {
        success: res => {
          this.withdraw = res.data.rows;
          this.cdr.detectChanges();
        },
      },
    );
  }

  setupBank() {
    this.httpService.post(
      '/v1/account/bankAccount/search',
      { page: 0, size: 99, filters: [{ name: 'memberId', value: this.id }] },
      {
        success: res => {
          this.bank = res.data.rows;
          this.cdr.detectChanges();
        },
      },
    );
  }

  setupAddress() {
    this.httpService.post(
      '/v1/app/deliveryAddress/search',
      { page: 0, size: 99, filters: [{ name: 'memberId', value: this.id }] },
      {
        success: res => {
          this.address = res.data.rows;
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

  goBack() {
    this.util.goBack();
  }
}
