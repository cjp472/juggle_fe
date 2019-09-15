import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskScheduleListComponent } from './schedule/schedule-list.component';
import { TaskIntervalListComponent } from './interval/interval-list.component';

const routes: Routes = [
  { path: 'schedule', component: TaskScheduleListComponent },
  { path: 'interval', component: TaskIntervalListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
