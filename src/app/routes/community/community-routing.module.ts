import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityListComponent } from './community/community-list.component';
import { PublishFormComponent } from './publish/publish-form.component';
import { CommunityListViewComponent } from './community/view/view.component';

const routes: Routes = [
  { path: 'community', component: CommunityListComponent },
  { path: 'community/:id', component: CommunityListViewComponent },
  { path: 'publish', component: PublishFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
