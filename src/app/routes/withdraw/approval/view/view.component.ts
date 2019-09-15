import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { STColumn, ReuseTabService } from '@delon/abc';
import { UtilService } from 'src/app/common/util.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-approval-withdraw-basic',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawApprovalViewComponent implements OnInit {
  id: number;
  data: any = {};
  history = [];
  historyColumns: STColumn[] = [
    { title: '流水号', index: 'code', width: 275 },
    { title: '会员昵称', index: 'member.nickName' },
    { title: '手机号', index: 'member.mobile' },
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
    {
      title: '状态',
      index: 'status',
      type: 'badge',
      badge: {
        PROCESS: { text: '审核中', color: 'processing' },
        PEND: { text: '待打款', color: 'warning' },
        PAID: { text: '已打款', color: 'success' },
        INVALID: { text: '已失效', color: 'error' },
      },
    },
    {
      title: '更新时间',
      index: 'updatedTime',
      type: 'date',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    public msg: NzMessageService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private util: UtilService,
    private modalService: ModalService,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '提现详情';
    this.id = this.util.getParam(this.route, 'id');
  }

  ngOnInit() {
    this.setupData();
  }

  setupData() {
    this.httpService.post(
      '/v1/approval/approval/' + this.id + '/read',
      {},
      {
        success: res => {
          this.data = res.data;
          this.cdr.detectChanges();
          this.setupHistory();
        },
      },
    );
  }

  setupHistory() {
    this.httpService.post(
      '/v1/app/withdraw/search',
      { page: 0, size: 5, filters: [{ name: 'memberId', value: this.data.memberId }] },
      {
        success: res => {
          this.history = res.data.rows;
          this.cdr.detectChanges();
        },
      },
    );
  }

  pass() {
    this.modalService.showDeleteConfirm('确定要审批通过该余额提现申请吗?', () => {
      this.httpService.post(
        '/v1/approval/approval/' + this.id + '/pass',
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.setupData();
          },
        },
      );
    });
  }

  reject() {
    this.modalService.showDeleteConfirm('确定要审批拒绝该余额提现申请吗?', () => {
      this.httpService.post(
        '/v1/approval/approval/' + this.id + '/reject',
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.setupData();
          },
        },
      );
    });
  }

  goBack() {
    this.util.goBack();
  }
}
