import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopTypeListComponent } from './type/type-list.component';
import { ShopTypeListEditComponent } from './type/edit/edit.component';
import { ShopProductListComponent } from './product/product.list.component';
import { ShopOrderListComponent } from './order/order-list.component';
import { ShopProductListEditComponent } from './product/edit/edit.component';
import { ShopOrderAdvancedComponent } from './order/view/view.component';
import { ShopCouponListComponent } from './coupon/coupon-list.component';
import { ShopCouponListEditComponent } from './coupon/edit/edit.component';
import { ShopProductViewComponent } from './product/view/view.component';
import { ShopProductSkuListEditComponent } from './product/view/edit/edit.component';
import { ShopShipEditComponent } from './order/view/ship/ship.component';
import { ShopSkutypeListComponent } from './skutype/skutype-list.component';
import { ShopSkutypeListEditComponent } from './skutype/edit/edit.component';
import { ShopTagListComponent } from './tag/tag-list.component';
import { ShopTagListEditComponent } from './tag/edit/edit.component';

const COMPONENTS = [
  ShopSkutypeListComponent,
  ShopTypeListComponent,
  ShopTagListComponent,
  ShopProductListComponent,
  ShopProductViewComponent,
  ShopOrderListComponent,
  ShopOrderAdvancedComponent,
  ShopCouponListComponent,
];
const COMPONENTS_NOROUNT = [
  ShopSkutypeListEditComponent,
  ShopTypeListEditComponent,
  ShopTagListEditComponent,
  ShopProductListEditComponent,
  ShopProductSkuListEditComponent,
  ShopCouponListEditComponent,
  ShopShipEditComponent,
];

@NgModule({
  imports: [SharedModule, ShopRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ShopModule {}
