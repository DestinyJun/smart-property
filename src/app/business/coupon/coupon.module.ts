import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponTotalComponent } from './coupon-total/coupon-total.component';
import { CouponReviewComponent } from './coupon-review/coupon-review.component';
import { CouponPendingReviewComponent } from './coupon-pending-review/coupon-pending-review.component';
import { CouponAuditedComponent } from './coupon-audited/coupon-audited.component';
import { CouponComponent } from './coupon/coupon.component';
import {CouponRoutingModule} from './coupon-routing.module';
import {RouterModule} from '@angular/router';
import {LoadingModule} from '../../common/components/loading/loading.module';
import {PagingModule} from '../../common/components/paging/paging.module';
import {
  ButtonModule, CalendarModule, CheckboxModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, InputTextareaModule,
  InputTextModule,
  MessageModule, MessageService,
  MessagesModule, RadioButtonModule,
  ScrollPanelModule, SpinnerModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    CouponTotalComponent,
    CouponReviewComponent,
    CouponPendingReviewComponent,
    CouponAuditedComponent,
    CouponComponent
  ],
  imports: [
    CommonModule,
    CouponRoutingModule,
    LoadingModule,
    InputTextModule,
    TableModule,
    ScrollPanelModule,
    DialogModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CheckboxModule,
    SpinnerModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    PagingModule,
    InputTextareaModule,
  ],
  providers: [MessageService, ConfirmationService]

})
export class CouponModule { }
