import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponReview} from '../../../common/model/coupon-review.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponReviewService} from '../../../common/services/coupon-review.service';
import {CouponPendingReview} from '../../../common/model/coupon-pending-review.model';
import {CouponPendingReviewService} from '../../../common/services/coupon-pending-review.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-coupon-pending-review',
  templateUrl: './coupon-pending-review.component.html',
  styleUrls: ['./coupon-pending-review.component.less']
})
export class CouponPendingReviewComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  // @ViewChild('file') file: Input;
  public couponPendingReviewTableTitle: any;
  public couponPendingReviewTableContent: CouponPendingReview[] = [];
  public couponPendingReviewTableTitleStyle: any;
  public couponPendingReviewSelect: any;
  // 添加相关
  // 审核相关
  public couponPendingReviewDialog: boolean;
  public reviewStatus = '通过';
  // public couponPendingReviewModify: any;
  public couponPendingReviewDetailDialog: boolean;
  public couponPendingReviewDetail: CouponPendingReview = new CouponPendingReview();
  public esDate: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponPendingReviewSeachData: any;
  public SearchOption = {
    village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
    region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
    building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
    unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
    room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  };
  public nowPage = 1;
  public couponTypeName: any;
  public couponEffectiveTime: any;
  constructor(
    // private ownreService: BfcouponPendingReviewService
    private couponPendingReviewSrv: CouponPendingReviewService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.couponPendingReviewInitialization();
  }

  // initialization houseinfo
  public couponPendingReviewInitialization(): void {
    console.log('这里是信息的初始化');
    this.couponPendingReviewTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponPendingReviewSrv.queryCouponPendingReviewPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponPendingReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.couponPendingReviewTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.couponPendingReviewSelect);

  }

  // condition search click
  public couponPendingReviewSearchClick(): void {
 
    console.log('这里是条件搜索');
  }
  // detail couponPendingReviewInfo
  public couponPendingReviewDetailClick(e): void {
    this.couponPendingReviewDetailDialog = true;
    console.log(e);
    this.couponPendingReviewDetail = e;
    if (e.effectiveTime === 0 ) {
      this.couponEffectiveTime = '无期限';
    } else  {
      this.couponEffectiveTime = e.effectiveTime + '天';
    }
    this.couponPendingReviewSrv.queryCouponType({}).subscribe(
      val => {
        console.log(val);
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
            this.couponTypeName = v.settingName;
          }
        });
      }
    );
  }

  // couponPendingReview
  public  couponPendingReviewClick(): void {
    if (this.couponPendingReviewSelect === undefined || this.couponPendingReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.couponPendingReviewSelect.length === 1) {
      this.couponPendingReviewDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');

    }
  }
  public  refundPendingReviewSureClick(): void {
    if (this.reviewStatus === '通过') {
      this.couponPendingReviewSrv.couponPendingReviewPassById({id: this.couponPendingReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.couponPendingReviewInitialization();
            this.couponPendingReviewSelect = null;
            this.couponPendingReviewDialog = false;
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

          }
        }
      );
    } else {
      this.couponPendingReviewSrv.couponPendingReviewNoPassById({id: this.couponPendingReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.couponPendingReviewInitialization();
            this.couponPendingReviewSelect = null;
            this.couponPendingReviewDialog = false;
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

          }
        }
      );
    }
  }
  // select houseinfo
  public couponPendingReviewonRowSelect(e): void {
    // this.couponPendingReviewModify = e.data;
  }
  // get couponPendingReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.couponPendingReviewSrv.queryCouponPendingReviewPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponPendingReviewTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.couponPendingReviewSelect = [];
  }
}
