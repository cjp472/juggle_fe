import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WithdrawApprovalListComponent } from './approval/approval-list.component';
import { WithdrawApprovalViewComponent } from './approval/view/view.component';
import { WithdrawHistoryListComponent } from './history/history-list.component';

const routes: Routes = [
  { path: 'approval', component: WithdrawApprovalListComponent },
  { path: 'approval/:id', component: WithdrawApprovalViewComponent },
  { path: 'history', component: WithdrawHistoryListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawRoutingModule {}
