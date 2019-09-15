import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DictionaryListComponent } from './dictionary/dictionary-list.component';
import { DomainListComponent } from './domain/domain-list.component';

const routes: Routes = [
  { path: 'domain', component: DomainListComponent },
  { path: 'dictionary', component: DictionaryListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
