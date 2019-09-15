import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaskRoutingModule } from './task-routing.module';
import { TaskScheduleListComponent } from './schedule/schedule-list.component';
import { TaskScheduleListEditComponent } from './schedule/edit/edit.component';
import { TaskIntervalListComponent } from './interval/interval-list.component';
import { TaskIntervalListEditComponent } from './interval/edit/edit.component';

const COMPONENTS = [TaskScheduleListComponent, TaskIntervalListComponent];
const COMPONENTS_NOROUNT = [TaskScheduleListEditComponent, TaskIntervalListEditComponent];

@NgModule({
  imports: [SharedModule, TaskRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class TaskModule {}
