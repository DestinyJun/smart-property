import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { BaseinfoRoutingModule } from './baseinfo-routing.module';
import { BaseinfoComponent } from './baseinfo/baseinfo.component';
import { BfTollComponent } from './bf-toll/bf-toll.component';
import { BfOwnerComponent } from './bf-owner/bf-owner.component';
import { BfVehicleComponent } from './bf-vehicle/bf-vehicle.component';
import { BfStaffComponent } from './bf-staff/bf-staff.component';
import {
  ButtonModule, CalendarModule, ConfirmationService, ConfirmDialogModule,
  DialogModule, DragDropModule, DropdownModule, FileUploadModule,
  InputTextModule,
  MessageModule,
  MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, TreeModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { BfTenantinfoComponent } from './bf-tenantinfo/bf-tenantinfo.component';
import {DataViewModule} from 'primeng/dataview';
import {PagingModule} from '../../common/components/paging/paging.module';
import {FormsModule} from '@angular/forms';
import { BfParkingspaceComponent } from './bf-parkingspace/bf-parkingspace.component';
import {LoadingModule} from '../../common/components/loading/loading.module';
import { BfCouponComponent } from './bf-coupon/bf-coupon.component';
import { BfRoombindChangeitemComponent } from './bf-roombind-changeitem/bf-roombind-changeitem.component';
import {PublicMethedService} from '../../common/public/public-methed.service';

@NgModule({
  declarations: [
    BaseinfoComponent,
    BfTollComponent,
    BfOwnerComponent,
    BfVehicleComponent,
    BfStaffComponent,
    BfTenantinfoComponent,
    BfParkingspaceComponent,
    BfCouponComponent,
    BfRoombindChangeitemComponent,
  ],
  imports: [
    CommonModule,
    BaseinfoRoutingModule,
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
    FileUploadModule,
    CalendarModule,
    LoadingModule,
    TreeModule,
  ],
  providers: [MessageService, ConfirmationService, DatePipe, PublicMethedService]
})
export class BaseinfoModule { }
