import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CmsRoutingModule } from './cms-routing.module';
import { ArticleListComponent } from './article/article-list.component';
import { ArticleListEditComponent } from './article/edit/edit.component';
import { ResourceListComponent } from './resource/resource-list.component';
import { ResourceListEditComponent } from './resource/edit/edit.component';

const COMPONENTS = [ArticleListComponent, ResourceListComponent];
const COMPONENTS_NOROUNT = [ArticleListEditComponent, ResourceListEditComponent];

@NgModule({
  imports: [SharedModule, CmsRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class CmsModule {}
