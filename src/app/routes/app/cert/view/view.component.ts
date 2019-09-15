import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { UtilService } from 'src/app/common/util.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/common/http.service';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { ModalService } from 'src/app/common/modal.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ReuseTabService } from '@delon/abc';

@Component({
  selector: 'app-cert-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertViewComponent implements OnInit {
  id: number;
  data: any = {};
  album: Array<IAlbum> = [];

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private util: UtilService,
    private modalService: ModalService,
    private httpService: HttpService,
    private lightbox: Lightbox,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '审批详情';
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
          this.cdr.detectChanges();
        },
      },
    );
  }

  pass() {
    this.modalService.showDeleteConfirm('确定要审批通过该实名认证申请吗?', () => {
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
    this.modalService.showDeleteConfirm('确定要审批拒绝该实名认证申请吗?', () => {
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
