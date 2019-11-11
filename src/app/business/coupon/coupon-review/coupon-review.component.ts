import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CouponReview} from '../../../common/model/coupon-review.model';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {CouponService} from '../../../common/services/coupon.service';

@Component({
  selector: 'rbi-coupon-review',
  templateUrl: './coupon-review.component.html',
  styleUrls: ['./coupon-review.component.less']
})
export class CouponReviewComponent implements OnInit {

  public couponReviewTableTitle: any;
  public couponReviewSelect: any;
  // 添加相关
  public esDate: any;
  // 审核相关
  public couponReviewDialog: any;
  public reviewStatus  = '通过';
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponReviewOption: any;
  public nowPage = 1;
  // 状态相关
  public couponTypeOption = [];
  public auditStatusOption = [];
  public pastDueOption = [];
  public userStatusOption = [];
  // 详情相关
  public couponReviewDetailOption: any;
  // 审核相关
  public reviewOption: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponReviewSrv: CouponService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.couponReviewInitialization();
  }

  // initialization houseinfo
  public couponReviewInitialization(): void {
    this.couponReviewTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.toolSrv.getNatStatus([{settingType: 'COUPON_TYPE'}], (data) => {
      this.couponTypeOption = this.toolSrv.setListMap(data.COUPON_TYPE);
    });
    this.toolSrv.getAdmStatus([{settingType: 'USE_STATUS'}, {settingType: 'PAST_DUE'}, {settingType: 'AUDIT_STATUS'}], (data) => {
      this.auditStatusOption = this.toolSrv.setListMap(data.AUDIT_STATUS);
      this.pastDueOption = this.toolSrv.setListMap(data.PAST_DUE);
      this.userStatusOption = this.toolSrv.setListMap(data.USE_STATUS);
      // console.log(this.userStatusOption);
      this.queryCouponPageData();
    });
    // this.couponReviewTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }

  // condition search click
  // public couponReviewSearchClick(): void {
  //   // }
  //   console.log('这里是条件搜索');
  // }
  // detail couponReviewInfo
  public couponReviewDetailClick(e): void {
    e.couponType = this.toolSrv.setValueToLabel(this.couponTypeOption, e.couponType);
    e.usageState = this.toolSrv.setValueToLabel(this.userStatusOption, e.usageState);

    this.couponReviewDetailOption = {
      dialog: true,
      tableHidden: false,
      width: '1000',
      type: 1,
      title: '详情',
      poplist: {
        popContent: e,
        popTitle:  [
          {field: 'villageName', header: '小区名称'},
          {field: 'regionName', header: '地块名称'},
          {field: 'buildingName', header: '楼栋名称'},
          {field: 'unitName', header: '单元名称'},
          {field: 'roomCode', header: '房间编号'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'couponType', header: '优惠券类型'},
          {field: 'surname', header: '客户姓名'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'money', header: '优惠金额'},
          {field: 'propertyFee', header: '抵扣物业费金额'},
          {field: 'balanceAmount', header: '剩余金额'},
          {field: 'usageState', header: '使用状态'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'dueTime', header: '物业费到期时间'},
          {field: 'auditStatus', header: '审核状态'},
          {field: 'startTime', header: '开始时间'},
          {field: 'endTime', header: '结束时间'},
          {field: 'remarks', header: '备注 '},
        ],
      }
    };
  }

  // couponreview
  public  couponReviewClick(): void {
    if (this.couponReviewSelect === undefined || this.couponReviewSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要审核的项');

    } else if (this.couponReviewSelect.length === 1) {
      this.reviewOption = {
        width: '500',
        dialog: true
      };
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行审核');
    }
  }
  // 审核判断
  public  couponReviewSureClick(e): void {
    if (e === '通过') {
      this.couponReviewSrv.couponReviewPassById({id: this.couponReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.clearData();
            this.couponReviewInitialization();
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

          }
        }
      );
    } else if (e === '不通过') {
      this.couponReviewSrv.couponReviewNoPassById({id: this.couponReviewSelect[0].id}).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success' , '操作成功', value.message);
            this.clearData();
            this.couponReviewInitialization();
          } else {
            this.toolSrv.setToast('error' , '操作失败', value.message);

          }
        }
      );
    } else {
      this.clearData();
    }
  }
  // 清除数据
  public clearData(): void {
    this.reviewOption.dialog = false;
    this.couponReviewSelect = [];
  }
  // get couponReview Pagination
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.queryCouponPageData();
    this.couponReviewSelect = [];
  }
  // 设置表格
  public  setTableOption(data1): void {
    this.couponReviewOption = {
      width: '101.4%',
      header: {
        data:   [
          {field: 'roomCode', header: '房间代码'},
          {field: 'couponName', header: '优惠券名称'},
          {field: 'surname', header: '客户名称'},
          {field: 'mobilePhone', header: '客户电话'},
          {field: 'effectiveTime', header: '有效时长'},
          {field: 'money', header: '金额'},
          {field: 'auditStatus', header: '审核状态'},
          {field: 'pastDue', header: '过期状态'},
          {field: 'operating', header: '操作'}
        ],
        style: {background: '#282A31', color: '#DEDEDE', height: '6vh'}
      },
      Content: {
        data: data1,
        styleone: {background: '#33353C', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
        styletwo: {background: '#2E3037', color: '#DEDEDE', textAlign: 'center', height: '2vw'},
      },
      type: 2,
      tableList:  [{label: '详情', color: '#6A72A1'}]
    };
  }

  // 选择数据
  public  selectData(e): void {
      this.couponReviewSelect = e;
  }

  // 分页查询
  public queryCouponPageData(): void {
    this.couponReviewSrv.queryCouponReviewPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        if (value.status === '1000') {
          value.data.contents.forEach( v => {
            v.effectiveTime = (v.effectiveTime === 0 || v.effectiveTime === '0') ? '无期限': v.effectiveTime + '天';
            v.auditStatus = this.toolSrv.setValueToLabel(this.auditStatusOption, v.auditStatus);
            v.pastDue = this.toolSrv.setValueToLabel(this.pastDueOption, v.pastDue);
          });
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }

  // 审核信息
}
