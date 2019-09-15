import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpreadListComponent } from './spread/spread-list.component';
import { GuideListComponent } from './guide/guide-list.component';
import { SaleListComponent } from './sale/sale-list.component';

const routes: Routes = [
  { path: 'spread', component: SpreadListComponent },
  { path: 'guide', component: GuideListComponent },
  { path: 'sale', component: SaleListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardRoutingModule {}
