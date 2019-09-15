import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/common/http.service';
import { Router } from '@angular/router';
import { ModalHelper } from '@delon/theme';
import { ProductListSelectComponent } from './product/product-select.component';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishFormComponent implements OnInit {
  form: FormGroup;
  thumbnail: string;
  submitting = false;
  communityOpts: [any];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modal: ModalHelper,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      communityId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      popularId: [null, []],
      popularName: [null, []],
    });
    this.setupForm();
  }

  setupForm() {
    this.httpService.post(
      '/v1/community/community/readAllEnabled',
      {},
      {
        success: res => {
          this.communityOpts = res.data;
        },
      },
    );
  }

  changeThumbnail(info: any) {
    if (info.type === 'success') {
      this.thumbnail = info.file.response.data[0];
    }
  }

  openProduct() {
    this.modal.create(ProductListSelectComponent, {}, { size: 'lg' }).subscribe(res => {
      this.form.value.popularId = res.id;
      this.form.value.popularName = res.title;
      this.form.setValue(this.form.value);
    });
  }

  submit() {
    this.submitting = true;
    this.form.value.thumbnail = this.thumbnail;
    this.httpService.post('/v1/community/communityPublish/create', this.form.value, {
      success: res => {
        this.submitting = false;
        this.msg.success(`提交成功`);
        this.form.reset();
        this.cdr.detectChanges();
        this.router.navigateByUrl(`/community/community/${res.data.communityId}`);
      },
    });
  }
}
