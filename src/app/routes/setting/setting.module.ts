import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SettingRoutingModule } from './setting-routing.module';
import { DictionaryListComponent } from './dictionary/dictionary-list.component';
import { DictionaryListEditComponent } from './dictionary/edit/edit.component';
import { DomainListComponent } from './domain/domain-list.component';
import { DomainListEditComponent } from './domain/edit/edit.component';

const COMPONENTS = [DictionaryListComponent, DomainListComponent];
const COMPONENTS_NOROUNT = [DictionaryListEditComponent, DomainListEditComponent];

@NgModule({
  imports: [SharedModule, SettingRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SettingModule {}
