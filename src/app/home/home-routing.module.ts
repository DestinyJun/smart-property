import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  // {path: '', redirectTo: '/home/main', pathMatch: 'full'},
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: 'main', loadChildren: '../business/main/main.module#MainModule'},
      {path: 'baseinfo', loadChildren: '../business/baseinfo/baseinfo.module#BaseinfoModule'},
      {path: 'charge', loadChildren: '../business/chargeman/chargeman.module#ChargemanModule'},
      // {path: 'assoc', loadChildren: '../business/association/association.module#AssociationModule'},
      // {path: 'monitor', loadChildren: '../business/monitor/monitor.module#MonitorModule'},
      {path: 'system', loadChildren: '../business/systemset/systemset.module#SystemsetModule'},
      {path: 'coupon', loadChildren: '../business/coupon/coupon.module#CouponModule'},
      {path: 'refund', loadChildren: '../business/refund/refund.module#RefundModule'},
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
