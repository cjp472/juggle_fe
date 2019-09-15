import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TaobaoRoutingModule } from './taobao-routing.module';
import { TaobaoCategoryListComponent } from './category/category-list.component';
import { TaobaoCategoryListEditComponent } from './category/edit/edit.component';
import { TaobaoBrandListComponent } from './brand/brand-list.component';
import { TaobaoBrandListEditComponent } from './brand/edit/edit.component';
import { TaobaoProductListLayoutComponent } from './product/product-layout.component';
import { TaobaoProductListComponent } from './product/list/product-list.component';
import { TaobaoTypeListComponent } from './type/type-list.component';
import { TaobaoTypeListEditComponent } from './type/edit/edit.component';
import { TaobaoFavourableListLayoutComponent } from './favourable/favourable-layout.component';
import { TaobaoFavourableListComponent } from './favourable/list/favourable-list.component';
import { TaobaoSelectionListLayoutComponent } from './selection/selection-layout.component';
import { TaobaoSelectionListComponent } from './selection/list/selection-list.component';
import { TaobaoFlashListLayoutComponent } from './flash/flash-layout.component';
import { TaobaoFlashListComponent } from './flash/list/flash-list.component';
import { TaobaoPopularListLayoutComponent } from './popular/popular-layout.component';
import { TaobaoPopularListComponent } from './popular/list/popular-list.component';
import { TaobaoGoodsListLayoutComponent } from './goods/goods-layout.component';
import { TaobaoGoodsListComponent } from './goods/list/goods-list.component';

const COMPONENTS = [
  TaobaoCategoryListComponent,
  TaobaoBrandListComponent,
  TaobaoGoodsListLayoutComponent,
  TaobaoGoodsListComponent,
  TaobaoProductListLayoutComponent,
  TaobaoProductListComponent,
  TaobaoFlashListLayoutComponent,
  TaobaoFlashListComponent,
  TaobaoSelectionListLayoutComponent,
  TaobaoSelectionListComponent,
  TaobaoFavourableListLayoutComponent,
  TaobaoFavourableListComponent,
  TaobaoPopularListLayoutComponent,
  TaobaoPopularListComponent,
  TaobaoTypeListComponent,
];
const COMPONENTS_NOROUNT = [TaobaoCategoryListEditComponent, TaobaoBrandListEditComponent, TaobaoTypeListEditComponent];

@NgModule({
  imports: [SharedModule, TaobaoRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class TaobaoModule {}
