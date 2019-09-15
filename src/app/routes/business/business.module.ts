import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BusinessRoutingModule } from './business-routing.module';
import { PushListComponent } from './push/push-list.component';
import { PushListEditComponent } from './push/edit/edit.component';
import { HotsearchListComponent } from './hotsearch/hotsearch-list.component';
import { HotsearchListEditComponent } from './hotsearch/edit/edit.component';
import { GroupmsgListComponent } from './groupmsg/groupmsg-list.component';
import { GroupmsgListEditComponent } from './groupmsg/edit/edit.component';

const COMPONENTS = [PushListComponent, HotsearchListComponent, GroupmsgListComponent];
const COMPONENTS_NOROUNT = [PushListEditComponent, HotsearchListEditComponent, GroupmsgListEditComponent];

@NgModule({
  imports: [SharedModule, BusinessRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class BusinessModule {}
