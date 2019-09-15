import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushListComponent } from './push/push-list.component';
import { HotsearchListComponent } from './hotsearch/hotsearch-list.component';
import { GroupmsgListComponent } from './groupmsg/groupmsg-list.component';

const routes: Routes = [
  { path: 'groupmsg', component: GroupmsgListComponent },
  { path: 'push', component: PushListComponent },
  { path: 'hotsearch', component: HotsearchListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
