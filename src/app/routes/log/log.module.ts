import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LogRoutingModule } from './log-routing.module';
import { ScheduleLogListComponent } from './schedule/schedule-list.component';
import { OperateLogListComponent } from './operate/operate-list.component';

const COMPONENTS = [ScheduleLogListComponent, OperateLogListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, LogRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class LogModule {}
