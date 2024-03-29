import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { ProRoutingModule } from './pro-routing.module';

import { BasicFormComponent } from './form/basic-form/basic-form.component';
import { StepFormComponent } from './form/step-form/step-form.component';
import { Step1Component } from './form/step-form/step1.component';
import { Step2Component } from './form/step-form/step2.component';
import { Step3Component } from './form/step-form/step3.component';
import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
import { ProTableListComponent } from './list/table-list/table-list.component';
import { ProBasicListComponent } from './list/basic-list/basic-list.component';
import { ProCardListComponent } from './list/card-list/card-list.component';
import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
import { ProResultSuccessComponent } from './result/success/success.component';
import { ProResultFailComponent } from './result/fail/fail.component';
import { ProAccountCenterComponent } from './account/center/center.component';
import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
import { ProAccountSettingsComponent } from './account/settings/settings.component';
import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
import { ProBasicListEditComponent } from './list/basic-list/edit/edit.component';

const COMPONENTS = [
  BasicFormComponent,
  StepFormComponent,
  AdvancedFormComponent,
  ProTableListComponent,
  ProBasicListComponent,
  ProCardListComponent,
  ProProfileBaseComponent,
  ProProfileAdvancedComponent,
  ProResultSuccessComponent,
  ProResultFailComponent,
  ProAccountCenterComponent,
  ProAccountCenterProjectsComponent,
  ProAccountCenterApplicationsComponent,
  ProAccountSettingsComponent,
  ProAccountSettingsBaseComponent,
  ProAccountSettingsSecurityComponent,
  ProAccountSettingsNotificationComponent,
];

const COMPONENTS_NOROUNT = [Step1Component, Step2Component, Step3Component, ProBasicListEditComponent];

@NgModule({
  imports: [SharedModule, ProRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProModule {}
