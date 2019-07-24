import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseinfoComponent} from './baseinfo/baseinfo.component';
import {BfTollComponent} from './bf-toll/bf-toll.component';
import {BfOwnerComponent} from './bf-owner/bf-owner.component';
import {BfVehicleComponent} from './bf-vehicle/bf-vehicle.component';
import {BfWorkgroupComponent} from './bf-workgroup/bf-workgroup.component';
import {BfStaffComponent} from './bf-staff/bf-staff.component';
import {BfDeviceinfoComponent} from './bf-deviceinfo/bf-deviceinfo.component';
import {BfProjectinfoComponent} from './bf-projectinfo/bf-projectinfo.component';
import {BfQrcodeComponent} from './bf-qrcode/bf-qrcode.component';
import {BfParcelinfoComponent} from './bf-parcelinfo/bf-parcelinfo.component';
import {BfUnitinfoComponent} from './bf-unitinfo/bf-unitinfo.component';
import {BfBuildinginfoComponent} from './bf-buildinginfo/bf-buildinginfo.component';
import {BfHouseinfoComponent} from './bf-houseinfo/bf-houseinfo.component';
import {BfTenantinfoComponent} from './bf-tenantinfo/bf-tenantinfo.component';
import {BfParkingspaceComponent} from './bf-parkingspace/bf-parkingspace.component';
import {CouponComponent} from '../coupon/coupon/coupon.component';
import {BfCouponComponent} from './bf-coupon/bf-coupon.component';
import {BfRoombindChangeitemComponent} from './bf-roombind-changeitem/bf-roombind-changeitem.component';

const routes: Routes = [
  {
    path: '',
    component: BaseinfoComponent,
    children: [
      {path: 'toll', component: BfTollComponent},
      {path: 'owner', component: BfOwnerComponent},
      {path: 'vehicle', component: BfVehicleComponent},
      // {path: 'workgroup', component: BfWorkgroupComponent},
      {path: 'staff', component: BfStaffComponent},
      // {path: 'deviceinfo', component: BfDeviceinfoComponent},
      // {path: 'projectinfo', component: BfProjectinfoComponent},
      {path: 'qrcode', component: BfQrcodeComponent},
      // {path: 'parcelinfo', component: BfParcelinfoComponent},
      // {path: 'unitinfo', component: BfUnitinfoComponent},
      // {path: 'buildinginfo', component: BfBuildinginfoComponent},
      // {path: 'houseinfo', component: BfHouseinfoComponent},
      {path: 'tenantinfo', component: BfTenantinfoComponent},
      {path: 'parkingspace', component: BfParkingspaceComponent},
      {path: 'coupon', component: BfCouponComponent},
      {path: 'roomCharge', component: BfRoombindChangeitemComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BaseinfoRoutingModule { }
