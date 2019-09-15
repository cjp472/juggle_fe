import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtrasPoiComponent } from './poi/poi.component';

const routes: Routes = [{ path: 'poi', component: ExtrasPoiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtrasRoutingModule {}
