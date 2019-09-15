import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user/user-list.component';
import { RoleListComponent } from './role/role-list.component';
import { UnitListComponent } from './unit/unit-list.component';

const routes: Routes = [
  { path: 'user', component: UserListComponent },
  { path: 'role', component: RoleListComponent },
  { path: 'unit', component: UnitListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
