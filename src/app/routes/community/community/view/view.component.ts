import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { UtilService } from 'src/app/common/util.service';
import { HttpService } from 'src/app/common/http.service';
import { ActivatedRoute } from '@angular/router';
import { ReuseTabService } from '@delon/abc';

@Component({
  selector: 'app-list-community',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityListViewComponent implements OnInit {
  id: number;
  page = 0;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private httpService: HttpService,
    private reuseTabService: ReuseTabService,
  ) {
    this.reuseTabService.title = '社区发布';
    this.id = this.utilService.getParam(this.route, 'id');
  }
  q: any = {
    ps: 5,
    categories: [],
    title: '',
    content: '',
  };

  list: any[] = [];
  loading = false;

  categories = [{ id: 0, text: '全部', value: false }];

  changeCategory(status: boolean, idx: number) {
    if (idx === 0) {
      this.categories.map(i => (i.value = status));
    } else {
      this.categories[idx].value = status;
    }
    this.getData();
  }

  ngOnInit() {
    this.setupCommunity();
    this.getData();
  }

  setupCommunity() {
    this.httpService.post(
      '/v1/community/community/readAllEnabled',
      {},
      {
        success: res => {
          res.data.map(item => {
            if (item.value !== this.id) {
              this.categories.push({ id: item.value, text: item.label, value: false });
            } else {
              this.categories.push({ id: item.value, text: item.label, value: true });
            }
          });
        },
      },
    );
  }

  getData(more = false) {
    this.loading = true;
    if (more === true) {
      this.page++;
    }
    this.httpService.post(
      '/v1/community/communityPublish/search',
      { page: this.page, size: 10, filters: this.filterHandel() },
      {
        success: res => {
          this.list = more ? this.list.concat(res.data.rows) : res.data.rows;
          this.loading = false;
          this.cdr.detectChanges();
        },
      },
    );
  }

  filterHandel() {
    const handels: Array<any> = [];
    if (this.categories[0].value !== true) {
      const categories = [];
      this.categories.forEach(category => {
        if (category.value === true) {
          categories.push(category.id);
        }
      });
      if (categories.length > 0) {
        handels.push({ name: 'communityId', op: 'in', value: categories });
      }
    }
    if (this.q.title) {
      handels.push({ name: 'title', op: '*', value: this.q.title });
    }
    if (this.q.content) {
      handels.push({ name: 'content', op: '*', value: this.q.content });
    }
    return handels;
  }

  goBack() {
    this.utilService.goBack();
  }
}
