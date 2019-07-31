import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddCouponTotal, CouponTotal} from '../../../common/model/coupon-total.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponTotalService} from '../../../common/services/coupon-total.service';
import {GlobalService} from '../../../common/services/global.service';
import {CouponAudited} from '../../../common/model/coupon-audited.model';
import {CouponAuditedService} from '../../../common/services/coupon-audited.service';
import {C} from '@angular/cdk/typings/esm5/keycodes';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-coupon-audited',
  templateUrl: './coupon-audited.component.html',
  styleUrls: ['./coupon-audited.component.less']
})
export class CouponAuditedComponent implements OnInit {


  @ViewChild('input', {static: true}) input: Input;
  // @ViewChild('file') file: Input;
  public couponAuditedTableTitle: any;
  public couponAuditedTableContent: CouponAudited[];
  // public couponAuditedTableContent: any;
  public couponAuditedTableTitleStyle: any;
  public couponAuditedSelect: any;
  // 添加相关
  public couponAuditedDetail: CouponAudited = new CouponAudited();
  // 修改相关
  // public couponModify: any;
  public couponAuditedDetailDialog: boolean;
  public esDate: any;
  // 上传相关
  // public couponAuditedUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponAuditedSeachData: any;
  // public SearchCoupon: SearchCoupon = new SearchCoupon();
  public nowPage = 1;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: [],
  };
  public couponSelectOption: any[] = [];
  public roonCodeSelectOption: any[] = [];
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponAuditedSrv: CouponAuditedService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService
  ) {
  }

  ngOnInit() {
    this.esDate = this.toolSrv.esDate;
    this.couponAuditedInitialization();
  }

  // initialization houseinfo
  public couponAuditedInitialization(): void {
    this.couponAuditedTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponAuditedSrv.queryCouponAuditedPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        this.couponAuditedTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.couponAuditedTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // this.globalSrv.queryVillageInfo({}).subscribe(
    //   (data) => {
    //     data.data.forEach( v => {
    //       this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
    //       // = v.villageName;
    //     });
    //     // this.villageplaceholder =  this.SearchOption.village[0].label;
    //   }
    // );
  }

/*  public  VillageChange(e): void {
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
      }
    );
  }
  public  buildingChange(e): void {
    this.SearchOption.unit = [];
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public  unitChange(e): void {
    this.roonCodeSelectOption = [];
  }*/

  // condition search click
  // public couponAuditedSearchClick(): void {
  //   console.log('这里是条件搜索');
  // }


  // detail couponAuditedInfo
  public couponAuditedDetailClick(e): void {
    this.couponAuditedDetailDialog = true;
    this.couponAuditedDetail = e;
    if (e.effectiveTime === 0 ) {
      this.couponEffectiveTime = '无期限';
    } else  {
      this.couponEffectiveTime = e.effectiveTime + '天';
    }
    this.couponAuditedSrv.queryCouponType({}).subscribe(
      val => {
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
            this.couponTypeName = v.settingName;
          }
        });
      }
    );
    this.toolSrv.getAdminStatus('PAST_DUE', (data) => {
      data.forEach( v => {
        if (this.couponAuditedDetail.pastDue.toString() === v.settingCode){
          this.couponAuditedDetail.pastDue = v.settingName;
        }
      });
    });
  }
  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.couponAuditedSrv.queryCouponAuditedPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.loadingHide = true;
        this.couponAuditedTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.couponAuditedSelect = [];
  }

  public clearData(): void {
    this.couponTypeName = null;
    this.couponMoney = null;
    this.couponEffectiveTime = null;
    this.SearchOption = {
      village: [],
      region: [],
      building: [],
      unit: [],
      room: [],
    };
    this.couponSelectOption = [];
    this.roonCodeSelectOption = [];
  }

}
