import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';
import { UserListComponent } from './user/user-list.component';
import { RoleListComponent } from './role/role-list.component';
import { UnitListComponent } from './unit/unit-list.component';
import { UserListEditComponent } from './user/edit/edit.component';
import { RoleListEditComponent } from './role/edit/edit.component';
import { UnitListEditComponent } from './unit/edit/edit.component';

const COMPONENTS = [UserListComponent, RoleListComponent, UnitListComponent];
const COMPONENTS_NOROUNT = [UserListEditComponent, RoleListEditComponent, UnitListEditComponent];

@NgModule({
  imports: [SharedModule, SystemRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SystemModule {}
