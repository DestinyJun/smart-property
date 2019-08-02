import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseinfoComponent} from './baseinfo/baseinfo.component';
import {BfTollComponent} from './bf-toll/bf-toll.component';
import {BfOwnerComponent} from './bf-owner/bf-owner.component';
import {BfVehicleComponent} from './bf-vehicle/bf-vehicle.component';
import {BfStaffComponent} from './bf-staff/bf-staff.component';

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
      {path: 'staff', component: BfStaffComponent},
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
