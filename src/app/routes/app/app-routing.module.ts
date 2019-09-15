import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberListComponent } from './member/member-list.component';
import { CertListComponent } from './cert/cert-list.component';
import { MemberViewComponent } from './member/view/view.component';
import { CertViewComponent } from './cert/view/view.component';

const routes: Routes = [
  { path: 'member', component: MemberListComponent },
  { path: 'member/:id', component: MemberViewComponent },
  { path: 'cert', component: CertListComponent },
  { path: 'cert/:id', component: CertViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
