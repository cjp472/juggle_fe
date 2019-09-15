import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RewardRoutingModule } from './reward-routing.module';
import { SpreadListComponent } from './spread/spread-list.component';
import { GuideListComponent } from './guide/guide-list.component';
import { SaleListComponent } from './sale/sale-list.component';

const COMPONENTS = [SpreadListComponent, GuideListComponent, SaleListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RewardRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RewardModule {}
