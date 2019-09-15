import { NzModalService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  constructor(protected modalService: NzModalService) {}

  showConfirm(content: string, ok: any) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOnOk: () => ok(),
    });
  }

  showDeleteConfirm(content: string, ok: any) {
    this.modalService.confirm({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOkType: 'danger',
      nzOnOk: () => ok(),
    });
  }

  info(content: string, ok: any) {
    this.modalService.info({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOnOk: () => ok(),
    });
  }

  success(content: string, ok: any) {
    this.modalService.success({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOnOk: () => ok(),
    });
  }

  error(content: string, ok: any) {
    this.modalService.error({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOnOk: () => ok(),
    });
  }

  warning(content: string, ok: any) {
    this.modalService.warning({
      nzTitle: '温馨提示',
      nzContent: content,
      nzOnOk: () => ok(),
    });
  }
}
