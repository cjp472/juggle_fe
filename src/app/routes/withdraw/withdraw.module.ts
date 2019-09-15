import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { WithdrawRoutingModule } from './withdraw-routing.module';
import { WithdrawApprovalListComponent } from './approval/approval-list.component';
import { WithdrawHistoryListComponent } from './history/history-list.component';
import { WithdrawApprovalViewComponent } from './approval/view/view.component';

const COMPONENTS = [WithdrawApprovalListComponent, WithdrawApprovalViewComponent, WithdrawHistoryListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, WithdrawRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class WithdrawModule {}
