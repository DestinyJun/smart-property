import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { SystemsetRoutingModule } from './systemset-routing.module';
import { SystemsetComponent } from './systemset/systemset.component';
import { SetConfigComponent } from './set-config/set-config.component';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  FileUploadModule,
  InputTextModule,
  MessagesModule,
  RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {SetPermissionComponent} from './set-permission/set-permission.component';
import {LoadingModule} from '../../common/components/loading/loading.module';
import { SetRoleComponent } from './set-role/set-role.component';
import { SetPartComponent } from './set-part/set-part.component';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';

@NgModule({
  declarations: [
    SystemsetComponent,
    SetConfigComponent,
    SetPermissionComponent,
    SetRoleComponent,
    SetPartComponent
  ],
  imports: [
    CommonModule,
    SystemsetRoutingModule,
    InputTextModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    DataViewModule,
    PagingModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    LoadingModule,
    CheckboxModule,
    TreeModule,
    BasicTableModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe, PublicMethedService]
})
export class SystemsetModule { }
