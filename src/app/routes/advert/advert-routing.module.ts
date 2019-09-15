import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvertListComponent } from './advert/advert-list.component';
import { AdvertTypeListComponent } from './type/type-list.component';

const routes: Routes = [
  { path: 'type', component: AdvertTypeListComponent },
  { path: 'advert', component: AdvertListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertRoutingModule {}
