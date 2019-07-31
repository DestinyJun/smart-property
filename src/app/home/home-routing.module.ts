import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  // {path: '', redirectTo: '/home/main', pathMatch: 'full'},
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: 'main', loadChildren: () => import('../business/main/main.module').then(m => m.MainModule)},
      {path: 'baseinfo', loadChildren: () => import('../business/baseinfo/baseinfo.module').then(m => m.BaseinfoModule)},
      {path: 'charge', loadChildren: () => import('../business/chargeman/chargeman.module').then(m => m.ChargemanModule)},
      {path: 'assoc', loadChildren: () => import('../business/association/association.module').then(m => m.AssociationModule)},
      {path: 'monitor', loadChildren: () => import('../business/monitor/monitor.module').then(m => m.MonitorModule)},
      {path: 'system', loadChildren: () => import('../business/systemset/systemset.module').then(m => m.SystemsetModule)},
      {path: 'coupon', loadChildren: () => import('../business/coupon/coupon.module').then(m => m.CouponModule)},
      {path: 'refund', loadChildren: () => import('../business/refund/refund.module').then(m => m.RefundModule)},
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
