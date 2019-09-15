import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AppRoutingModule } from './app-routing.module';
import { MemberListComponent } from './member/member-list.component';
import { CertListComponent } from './cert/cert-list.component';
import { MemberViewComponent } from './member/view/view.component';
import { CertViewComponent } from './cert/view/view.component';

const COMPONENTS = [MemberListComponent, MemberViewComponent, CertListComponent, CertViewComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, AppRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class AppModule {}
