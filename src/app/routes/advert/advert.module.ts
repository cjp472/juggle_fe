import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AdvertRoutingModule } from './advert-routing.module';
import { AdvertListComponent } from './advert/advert-list.component';
import { AdvertTypeListComponent } from './type/type-list.component';
import { AdvertTypeListEditComponent } from './type/edit/edit.component';
import { AdvertListEditComponent } from './advert/edit/edit.component';

const COMPONENTS = [AdvertListComponent, AdvertTypeListComponent];
const COMPONENTS_NOROUNT = [AdvertTypeListEditComponent, AdvertListEditComponent];

@NgModule({
  imports: [SharedModule, AdvertRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class AdvertModule {}
