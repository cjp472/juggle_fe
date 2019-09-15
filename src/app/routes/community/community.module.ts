import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityListComponent } from './community/community-list.component';
import { PublishFormComponent } from './publish/publish-form.component';
import { CommunityListEditComponent } from './community/edit/edit.component';
import { CommunityListViewComponent } from './community/view/view.component';
import { ProductListSelectComponent } from './publish/product/product-select.component';

const COMPONENTS = [CommunityListComponent, CommunityListViewComponent, PublishFormComponent];
const COMPONENTS_NOROUNT = [CommunityListEditComponent, ProductListSelectComponent];

@NgModule({
  imports: [SharedModule, CommunityRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class CommunityModule {}
