import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhonebillListComponent } from './phonebill/phonebill-list.component';
import { PhoneskuListComponent } from './phonesku/phonesku-list.component';

const routes: Routes = [
  { path: 'phonesku', component: PhoneskuListComponent },
  { path: 'phonebill', component: PhonebillListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargeRoutingModule {}
