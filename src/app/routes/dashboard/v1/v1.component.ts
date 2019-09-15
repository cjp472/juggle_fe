import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/common/http.service';

@Component({
  selector: 'app-dashboard-v1',
  templateUrl: './v1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV1Component implements OnInit {
  census = {
    memberNum: 0,
    shopProductNum: 0,
    shopOrderNum: 0,
    taobaoProductNum: 0,
  };
  todoData: any[] = [
    {
      completed: true,
      avatar: '1',
      name: '苏先生',
      content: `请告诉我，我应该说点什么好？`,
    },
    {
      completed: false,
      avatar: '2',
      name: 'はなさき',
      content: `ハルカソラトキヘダツヒカリ`,
    },
    {
      completed: false,
      avatar: '3',
      name: 'cipchk',
      content: `this world was never meant for one as beautiful as you.`,
    },
    {
      completed: false,
      avatar: '4',
      name: 'Kent',
      content: `my heart is beating with hers`,
    },
    {
      completed: false,
      avatar: '5',
      name: 'Are you',
      content: `They always said that I love beautiful girl than my friends`,
    },
    {
      completed: false,
      avatar: '6',
      name: 'Forever',
      content: `Walking through green fields ，sunshine in my eyes.`,
    },
  ];

  webSite: any[];
  salesData: any[];
  offlineChartData: any[];

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef, private httpService: HttpService) {}

  ngOnInit() {
    this.http.get('/chart').subscribe((res: any) => {
      this.webSite = res.visitData.slice(0, 10);
      this.salesData = res.salesData;
      this.offlineChartData = res.offlineChartData;
      this.cdr.detectChanges();
    });
    this.setupCensus();
  }

  setupCensus() {
    this.httpService.post(
      '/v1/platform/dashboard/getCensus',
      {},
      {
        success: res => {
          this.census = res.data;
        },
      },
    );
  }
}
