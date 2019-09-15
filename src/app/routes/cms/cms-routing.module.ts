import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleListComponent } from './article/article-list.component';
import { ResourceListComponent } from './resource/resource-list.component';

const routes: Routes = [
  { path: 'article', component: ArticleListComponent },
  { path: 'resource', component: ResourceListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
