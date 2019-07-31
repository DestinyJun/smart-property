import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AddCoupon, Coupon, ModifyCoupon} from '../../../common/model/charge-coupon.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChargeCouponService} from '../../../common/services/charge-coupon.service';
import {BfCouponService} from '../../../common/services/bf-coupon.service';
import {AddBfCoupon, ModifyBfCoupon} from '../../../common/model/bf-coupon.model';
import {Dropdown} from 'primeng/primeng';

@Component({
  selector: 'rbi-bf-coupon',
  templateUrl: './bf-coupon.component.html',
  styleUrls: ['./bf-coupon.component.less']
})
export class BfCouponComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  @ViewChild('addcouponType', {static: true}) addcouponType: Dropdown;
  @ViewChild('addChargeCode', {static: true}) addChargeCode: Dropdown;
  @ViewChild('addEffectiveTime', {static: true}) addEffectiveTime: Dropdown;
  @ViewChild('modifyeffectiveTime', {static: true}) modifyeffectiveTime: Dropdown;
  @ViewChild('modifycouponType', {static: true}) modifycouponType: Dropdown;
  @ViewChild('modifyChargeCode', {static: true}) modifychargeCode: Dropdown;
  // @ViewChild('file') file: Input;
  public couponTableTitle: any;
  public couponTableContent: Coupon[];
  // public couponTableContent: any;
  public couponTableTitleStyle: any;
  public couponSelect: ModifyBfCoupon[] = [];
  // 添加相关
  public couponAddDialog: boolean;
  public couponAdd: AddBfCoupon = new AddBfCoupon();
  // public couponAdd: any;
  // 修改相关
  public couponModifayDialog: boolean;
  public couponModify: ModifyBfCoupon = new ModifyBfCoupon();
  // public couponModify: any;
  public couponDetailDialog: boolean;
  public couponDetail: ModifyBfCoupon = new ModifyBfCoupon();
  public esDate = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    clear: '清除'
  };
  // 上传相关
  // public couponUploadFileDialog: boolean;
  // public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  public couponSeachData: any;
  public couponTypeData: any[] = [];
  public EffectiveTime: any[] = [];
  public ChargeCodeData: any[] = [];
  public deleteIds: any[] = [];
  public modifyCouponType: any;
  public modifyChargeName: any;
  public modifyEffectiveTime: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private ownreService: BfcouponService
    private couponSrv: BfCouponService
  ) { }
  ngOnInit() {
    this.couponInitialization();
  }

  // initialization houseinfo
  public  couponInitialization(): void {
    this.couponTableTitle = [
      {field: 'chargeCode', header: '收费项目编号'},
      {field: 'couponCode', header: '优惠券编号'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.couponSrv.queryCouponPagination({pageNo: 1, pageSize: 10 }).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};
      }
    );
    this.couponTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

    this.couponSrv.queryEffectiveTime({}).subscribe(
      value => {
        value.data.forEach( v => {
          if (v.settingName === '0') {
            this.EffectiveTime.push({label: '无限期', value: v.settingName});
          } else {
            this.EffectiveTime.push({label:  v.settingName + '天', value: v.settingName});
          }
        });
      }
    );
    this.couponSrv.queryCouponType({}).subscribe(
      value => {
        value.data.forEach( v => {
          this.couponTypeData.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.couponSrv.queryChargeCode({}).subscribe(
      val => {
        console.log(val);
        val.data.forEach( v => {
          this.ChargeCodeData.push({label: v.chargeName, value: v.chargeCode});
        });
      }
    );
  }
  // condition search click
  public  couponSearchClick(): void {
    // @ts-ignore
    // if (this.couponSeachData !== undefined ) {
    //   if (isNaN(this.couponSeachData)) {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   } else {
    //     this.chargeCouponSrv.queryConditionalCoupon({}).subscribe(
    //       (value) => {
    //         console.log(value);
    //       }
    //     );
    //   }
    // }
    console.log('这里是条件搜索');
  }
  // couponType change
  public  couponTypeChange(e): void {
      console.log(e);
      this.couponAdd.couponType = e.value;
      this.couponModify.couponType = e.value;
  }
  public  chargeCodeChange(e): void {
    console.log(e);
    this.couponAdd.chargeCode = e.value;
    this.couponModify.chargeCode = e.value;
  }
  public  EffectiveTimeChange(e): void {
    this.couponAdd.effectiveTime = e.value;
    this.couponModify.effectiveTime = e.value;
  }
  // add coupon
  public  couponAddClick(): void {
    this.couponAddDialog = true;

    console.log('这里是添加信息');
  }
  // sure add houseinfo
  public  couponAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.couponAdd);

        this.couponSrv.addCoupon(this.couponAdd).subscribe(
        value => {
          this.setToast('success', '操作成功', value.message);
          this.couponAdd = new AddBfCoupon();
          this.couponInitialization();
          this.couponAddDialog = false;
          this.clearData();
        }
      );
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // detail couponInfo
  public  couponDetailClick(e): void {
    this.couponDetailDialog = true;
    this.couponDetail = e;
  }
  // modify coupon
  public couponModifyClick(): void {
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');

    } else if (this.couponSelect.length === 1) {
      this.couponModify = this.couponSelect[0];
      console.log(this.couponModify);
      console.log(this.EffectiveTime);

      this.ChargeCodeData.forEach(v => {
        if (this.couponModify.chargeCode === v.value) {
          this.modifyChargeName = v.label;
        }
      });
      this.EffectiveTime.forEach(v => {
        if (Number(this.couponModify.effectiveTime) === Number(v.value)) {
          this.modifyEffectiveTime = v.label;
          console.log(v.label);
        }
      });
      this.couponTypeData.forEach(v => {
        if (this.couponModify.couponType === v.value) {
          this.modifyCouponType = v.label;
        }
      });
      this.couponModifayDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify coupon
  public  couponModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.couponSelect);
        this.couponSrv.updateCoupon(this.couponModify).subscribe(
          value => {
             // console.log(value);
            this.setToast('success', '操作成功', value.message);
            this.couponInitialization();
            this.couponModifayDialog = false;
            this.clearData();

          }
        );
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete coupon
  public  couponDeleteClick(): void {
    if (this.couponSelect === undefined || this.couponSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.couponSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.couponSelect.forEach( v => {
            this.deleteIds.push({id: v.id});
          });
          console.log(this.couponSelect);
          this.couponSrv.deleteCoupon({data: this.deleteIds}).subscribe(
            (val) => {
              console.log(val);
              this.setToast('success', '操作成功', '删除成功');
              this.couponInitialization();
              this.clearData();
            }
          );

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }

  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadingHide = false;

    this.couponSrv.queryCouponPagination({pageNo: event, pageSize: 10 }).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage:  value.data.pageNo};
      }
    );
    this.couponSelect = [];
  }
  // add more info Dialog
  // public  AddMoreClick(): void {
  //   // this.couponUploadFileDialog = true;
  // }
  public  setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }
  public  clearData(): void {
    this.couponSelect = [];
    this.modifyCouponType = null;
    this.modifyChargeName = null;
    this.modifyEffectiveTime = null;
    this.couponModify = new ModifyBfCoupon();
    this.couponAdd = new AddBfCoupon();
    this.addcouponType.selectedOption = null;
    this.addChargeCode.selectedOption = null;
    this.addEffectiveTime.selectedOption = null;
    this.modifycouponType.selectedOption = null;
    this.modifychargeCode.selectedOption = null;
    this.modifyeffectiveTime.selectedOption = null;
  }
}
