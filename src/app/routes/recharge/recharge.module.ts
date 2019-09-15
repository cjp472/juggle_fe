import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RechargeRoutingModule } from './recharge-routing.module';
import { PhonebillListComponent } from './phonebill/phonebill-list.component';
import { PhoneskuListComponent } from './phonesku/phonesku-list.component';
import { PhoneskuEditComponent } from './phonesku/edit/edit.component';

const COMPONENTS = [PhoneskuListComponent, PhonebillListComponent];
const COMPONENTS_NOROUNT = [PhoneskuEditComponent];

@NgModule({
  imports: [SharedModule, RechargeRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RechargeModule {}
