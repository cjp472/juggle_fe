import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { User, SettingService } from 'src/app/common/setting.service';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  user: User;
  constructor(public settings: SettingsService, settingService: SettingService) {
    this.user = settingService.user;
  }
}
