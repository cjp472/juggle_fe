import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaobaoCategoryListComponent } from './category/category-list.component';
import { TaobaoBrandListComponent } from './brand/brand-list.component';
import { TaobaoProductListLayoutComponent } from './product/product-layout.component';
import { TaobaoProductListComponent } from './product/list/product-list.component';
import { TaobaoTypeListComponent } from './type/type-list.component';
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

const routes: Routes = [
  { path: 'category', component: TaobaoCategoryListComponent },
  { path: 'brand', component: TaobaoBrandListComponent },
  {
    path: 'goods',
    children: [
      {
        path: '',
        component: TaobaoGoodsListLayoutComponent,
        children: [{ path: 'list', component: TaobaoGoodsListComponent }],
      },
    ],
  },
  {
    path: 'product',
    children: [
      {
        path: '',
        component: TaobaoProductListLayoutComponent,
        children: [{ path: 'list', component: TaobaoProductListComponent }],
      },
    ],
  },
  {
    path: 'flash',
    children: [
      {
        path: '',
        component: TaobaoFlashListLayoutComponent,
        children: [{ path: 'list', component: TaobaoFlashListComponent }],
      },
    ],
  },
  {
    path: 'selection',
    children: [
      {
        path: '',
        component: TaobaoSelectionListLayoutComponent,
        children: [{ path: 'list', component: TaobaoSelectionListComponent }],
      },
    ],
  },
  {
    path: 'favourable',
    children: [
      {
        path: '',
        component: TaobaoFavourableListLayoutComponent,
        children: [{ path: 'list', component: TaobaoFavourableListComponent }],
      },
    ],
  },
  {
    path: 'popular',
    children: [
      {
        path: '',
        component: TaobaoPopularListLayoutComponent,
        children: [{ path: 'list', component: TaobaoPopularListComponent }],
      },
    ],
  },
  { path: 'type', component: TaobaoTypeListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaobaoRoutingModule {}
