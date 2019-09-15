import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleLogListComponent } from './schedule/schedule-list.component';
import { OperateLogListComponent } from './operate/operate-list.component';

const routes: Routes = [
  { path: 'schedule', component: ScheduleLogListComponent },
  { path: 'operate', component: OperateLogListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRoutingModule {}
