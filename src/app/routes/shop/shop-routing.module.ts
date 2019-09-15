import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopTypeListComponent } from './type/type-list.component';
import { ShopProductListComponent } from './product/product.list.component';
import { ShopOrderListComponent } from './order/order-list.component';
import { ShopOrderAdvancedComponent } from './order/view/view.component';
import { ShopCouponListComponent } from './coupon/coupon-list.component';
import { ShopProductViewComponent } from './product/view/view.component';
import { ShopSkutypeListComponent } from './skutype/skutype-list.component';
import { ShopTagListComponent } from './tag/tag-list.component';

const routes: Routes = [
  { path: 'type', component: ShopTypeListComponent },
  { path: 'skutype', component: ShopSkutypeListComponent },
  { path: 'tag', component: ShopTagListComponent },
  { path: 'product', component: ShopProductListComponent },
  { path: 'product/:id', component: ShopProductViewComponent },
  { path: 'order', component: ShopOrderListComponent },
  { path: 'order/:id', component: ShopOrderAdvancedComponent },
  { path: 'coupon', component: ShopCouponListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
