import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { ExtrasRoutingModule } from './extras-routing.module';
import { ExtrasPoiComponent } from './poi/poi.component';
import { ExtrasPoiEditComponent } from './poi/edit/edit.component';

const COMPONENTS = [ExtrasPoiComponent];
const COMPONENTS_NOROUNT = [ExtrasPoiEditComponent];

@NgModule({
  imports: [SharedModule, ExtrasRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExtrasModule {}
