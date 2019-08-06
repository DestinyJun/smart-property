import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CouponTotalService} from '../../../common/services/coupon-total.service';
import {AddCouponTotal, CouponTotal, SearchCoupon} from '../../../common/model/coupon-total.model';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {DialogModel} from '../../../common/components/basic-dialog/dialog.model';

@Component({
  selector: 'rbi-coupon-total',
  templateUrl: './coupon-total.component.html',
  styleUrls: ['./coupon-total.component.less']
})
export class CouponTotalComponent implements OnInit {


  @ViewChild('input', {static: true}) input: Input;
  // @ViewChild('file') file: Input;
  public couponTotalTableTitle: any;
  public couponTotalTableContent: CouponTotal[];
  // public couponTotalTableContent: any;
  public couponTotalTableTitleStyle: any;
  public couponTotalSelect: any;
  // 添加相关
  public couponTotalAddDialog: boolean;
  public AddcouponTotal: AddCouponTotal = new AddCouponTotal();
  public couponTotalDetail: CouponTotal = new CouponTotal();
  // 条件查询
  public SearchCoupon: SearchCoupon = new SearchCoupon();
  public esDate: any;
  // 其他相关
  public couponTotalDetailDialog: any;
  public deleteIds: any[] = [];
  public cleanTimer: any; // 清除时钟
  public option: any;
  public loadingHide = true;
  // public couponTotalSeachData: any;
  public nowPage = 1;
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: []
  };
  public couponSelectOption: any[] = [];
  public roonCodeSelectOption: any[] = [];
  public couponTypeName: any;
  public couponMoney: any;
  public couponEffectiveTime: any;
  public pastDueOption: any[] = [];
  public auditStatusOption: any[] = [];

  public optionDialog: DialogModel = new DialogModel();
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private couponTotalSrv: CouponTotalService,
    private globalSrv: GlobalService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.couponTotalInitialization();
  }
  // initialization houseinfo
  public couponTotalInitialization(): void {
    console.log('这里是信息的初始化');
    this.esDate = this.toolSrv.esDate;
    this.AddcouponTotal.mobilePhone = null;
    this.AddcouponTotal.roomCode = null;
    this.AddcouponTotal.remarks = null;
    this.couponTotalTableTitle = [
      {field: 'roomCode', header: '房间代码'},
      {field: 'couponName', header: '优惠券名称'},
      {field: 'surname', header: '客户名称'},
      {field: 'mobilePhone', header: '客户电话'},
      {field: 'effectiveTime', header: '有效时长'},
      {field: 'money', header: '金额'},
      {field: 'auditStatus', header: '审核状态'},
      {field: 'pastDue', header: '过期状态'},
      {field: 'operating', header: '操作'}
    ];
    this.loadingHide = false;
    this.toolSrv.getAdminStatus('PAST_DUE', (e) => {
      e.forEach( v => {
        this.pastDueOption.push({label: v.settingName, value: v.settingCode});
      });
    });
    this.toolSrv.getAdminStatus('AUDIT_STATUS', (e) => {
      e.forEach( v => {
        this.auditStatusOption.push({label: v.settingName, value: v.settingCode});
      });
    });
    const page = setInterval(() => {
      if (this.pastDueOption.length > 0 && this.auditStatusOption.length > 0) {
          this.couponTotalSrv.queryCouponPageData({pageNo: this.nowPage, pageSize: 10}).subscribe(
          (value) => {
            this.loadingHide = true;
            clearInterval(page);
            if (value.status === '1000') {
              value.data.contents.forEach( h => {
                this.pastDueOption.forEach(v => {
                  if (h.pastDue.toString() === v.value) {
                    h.pastDue = v.label;
                  }
                });
                this.auditStatusOption.forEach(v => {
                  if (h.auditStatus.toString() === v.value) {
                    h.auditStatus = v.label;
                  }
                });
              });
              this.couponTotalTableContent = value.data.contents;
              this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            }  else  {
              this.toolSrv.setToast('error', '请求成功', value.message);
            }
          }
        );
       }
      }, 100);

    this.couponTotalTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        if (data.status === '1000') {
          data.data.forEach( v => {
            this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          });
        }
      }
    );
  }
  // query region
  public  VillageChange(e): void {
    this.SearchCoupon.villageCode = '';
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    for (const searchOptionKey in this.SearchOption) {
      if (searchOptionKey !== 'village') {
        this.SearchOption[searchOptionKey] = [];
      }
    }
    // this.SearchCoupon.villageCode = e.value;
    this.AddcouponTotal.villageName = e.originalEvent.target.innerText;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // query building
  public  regionChange(e): void {
    this.SearchCoupon.regionCode = '';
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.AddcouponTotal.regionName = e.originalEvent.target.innerText;
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
  // query unit
  public  buildingChange(e): void {
    this.SearchCoupon.buildingCode = '';
    this.SearchCoupon.unitCode = '';
    this.SearchOption.unit = [];
    this.SearchCoupon.buildingCode = e.value;
    this.SearchOption.room = [];
    this.AddcouponTotal.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // query roomCode
  public  unitChange(e): void {
    this.SearchCoupon.unitCode = '';
    this.SearchCoupon.unitCode = e.value;
    this.roonCodeSelectOption = [];
    this.AddcouponTotal.unitName = e.originalEvent.target.innerText;

    this.couponTotalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );

  }
  // condition search click
  public couponTotalSearchClick(): void {
    if (this.SearchCoupon.buildingCode === '' && this.SearchCoupon.mobilePhone === undefined) {
      this.toolSrv.setToast('error', '搜索失败', '搜索信息条件请具体到楼栋');
    } else {
      this.SearchCoupon.pageNo = 1;
      this.SearchCoupon.pageSize = 10;
      // @ts-ignore
      this.loadHidden = false;
      this.couponTotalSrv.queryCouponPageData(this.SearchCoupon).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadingHide = true;
            if (value.data.contents) {
              this.toolSrv.setToast('success', '搜索成功', value.message);
              this.couponTotalTableContent = value.data.contents;
            } else {
              this.toolSrv.setToast('success', '搜索成功', '数据为空');
            }
          } else {
            this.toolSrv.setToast('error', '搜索失败', value.message);

          }
        }
      );
    }
  }
  // add coupon
  public couponTotalAddClick(): void {
    this.couponSelectOption = [];
    this.couponTotalSrv.queryCouponList({}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( val => {
          this.couponSelectOption.push({label: val.couponName, value: val.couponCode});
        });
      }
    );
    this.optionDialog = {
      type: 'add',
      title: '添加信息',
      width: '800',
      dataList: [
        {
        value: {
          dropdown: {
            value: 'villageCode',
            label: '请选择小区',
            option: this.SearchOption.village
          },
          radioBox: [],
          date: {
            label: '',
            value: '',
          },
          textBox: {
            label: '',
            value: '',
            col: '',
            row: '',
          },
          input: {
            label: '',
            value: '',
            filter: '',
          },
        },
        name: '小区名称',
        type: 'dropdown'
      },
        {
        value: {
          dropdown: {
            value: 'regionCode',
            label: '请选择地块',
            option: this.SearchOption.village
          },
          radioBox: [],
          date: {
            label: '',
            value: '',
          },
          textBox: {
            label: '',
            value: '',
            col: '',
            row: '',
          },
          input: {
            label: '',
            value: '',
            filter: '',
          },
        },
        name: '地块名称',
        type: 'dropdown'
      },
        {
        value: {
          dropdown: {
            value: 'buildingCode',
            label: '请选择楼栋',
            option: this.SearchOption.village
          },
          radioBox: [],
          date: {
            label: '',
            value: '',
          },
          textBox: {
            label: '',
            value: '',
            col: '',
            row: '',
          },
          input: {
            label: '',
            value: '',
            filter: '',
          },
        },
        name: '楼栋名称',
        type: 'dropdown'
      },
        {
          value: {
            dropdown: {
              value: 'buildingCode',
              label: '请选择楼栋',
              option: this.SearchOption.village
            },
            radioBox: [],
            date: {
              label: '',
              value: '',
            },
            textBox: {
              label: '',
              value: '',
              col: '',
              row: '',
            },
            input: {
              label: '',
              value: '',
              filter: '',
            },
          },
          name: '单元名称',
          type: 'dropdown'
        },
        {
          value: {
            dropdown: {
              value: 'buildingCode',
              label: '请选择楼栋',
              option: this.SearchOption.village
            },
            radioBox: [],
            date: {
              label: '',
              value: '',
            },
            textBox: {
              label: '',
              value: '',
              col: '',
              row: '',
            },
            input: {
              label: '',
              value: '',
              filter: '',
            },
          },
          name: '房屋编号',
          type: 'dropdown'
        },
        {
          value: {
            dropdown: {
              value: 'buildingCode',
              label: '请选择楼栋',
              option: this.SearchOption.village
            },
            radioBox: [],
            date: {
              label: '',
              value: '',
            },
            textBox: {
              label: '',
              value: '',
              col: '',
              row: '',
            },
            input: {
              label: '请输入客户电话',
              value: 'mobilePhone',
              filter: 'number',
            },
          },
          name: '客户电话',
          type: 'input'
        },
      ]
    };
    // this.couponTotalAddDialog = true;
    console.log('这里是添加信息');
  }
  // search userInfo
  public getUserInfo(): void {
      if (this.AddcouponTotal.mobilePhone !== null && this.AddcouponTotal.roomCode !== null) {
         this.couponTotalSrv.queryCouponUserInfo({roomCode: this.AddcouponTotal.roomCode, mobilePhone: this.AddcouponTotal.mobilePhone}).subscribe(
           value => {
             this.AddcouponTotal.surname = value.data.customerInfoDO.surname;
             this.AddcouponTotal.userId = value.data.customerInfoDO.userId;
           }
         );
      }
  }
  // Choose a coupon
  public couponSelectChange(e): void {
    this.AddcouponTotal.couponName = e.originalEvent.target.innerText;
    this.couponTotalSrv.queryCouponInfo({couponCode: this.AddcouponTotal.couponCode}).subscribe(
      value => {
        console.log(value);
        this.AddcouponTotal.effectiveTime = value.data.effectiveTime;
        this.AddcouponTotal.money = value.data.money;
        this.couponMoney = '￥' + this.AddcouponTotal.money;
        this.AddcouponTotal.organizationId = value.data.organizationId;
        this.AddcouponTotal.chargeCode = value.data.chargeCode;
        if (value.data.effectiveTime === 0 ) {
          this.couponEffectiveTime = '无期限';
        } else  {
          this.couponEffectiveTime = value.data.effectiveTime + '天';
        }
        this.AddcouponTotal.couponType = value.data.couponType;
        this.couponTotalSrv.queryCouponType({}).subscribe(
          val => {
            console.log(val);
            val.data.forEach( v => {
              if (this.AddcouponTotal.couponType === v.settingCode) {
                this.couponTypeName = v.settingName;
              }
            });
          }
        );
      }
    );
    console.log(this.AddcouponTotal.couponName);
  }
  // sure add houseinfo
  public couponTotalAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.couponTotalSrv.addCouponInfo(this.AddcouponTotal).subscribe(
        value => {
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', value.message);
            this.couponTotalInitialization();
            this.couponTotalAddDialog = false;
            this.clearData();
          } else {
            this.toolSrv.setToast('error', '增加失败', value.message);
          }
        }
      );
    });
  }
  // detail couponTotalInfo
  public couponTotalDetailClick(e): void {
    this.couponTotalDetail = e;
    if (e.effectiveTime === 0 ) {
      this.couponEffectiveTime = '无期限';
    } else  {
      this.couponEffectiveTime = e.effectiveTime + '天';
    }
    this.couponTotalSrv.queryCouponType({}).subscribe(
      val => {
        val.data.forEach( v => {
          if (e.couponType === v.settingCode) {
            this.couponTypeName = v.settingName;
          }
        });
      }
    );
    this.toolSrv.getAdminStatus('USE_STATUS', (value) => {
      value.data.forEach( v => {
        if (e.usageState.toString() === v.settingCode) {
          this.couponTotalDetail.usageState = v.settingName;
        }
      });
    });
    this.toolSrv.getAdminStatus('PAST_DUE', (value) => {
      value.data.forEach( v => {
        if (e.pastDue.toString() === v.settingCode) {
          this.couponTotalDetail.pastDue = v.settingName;
        }
      });
    });
    this.toolSrv.getAdminStatus('AUDIT_STATUS', (value) => {
      value.data.forEach( v => {
        if (e.auditStatus.toString() === v.settingCode) {
          this.couponTotalDetail.auditStatus = v.settingName;
        }
      });
    });
    console.log(e);
    this.couponTotalDetailDialog = true;
  }
  // delete coupon
  public couponTotalDeleteClick(): void {
    if (this.couponTotalSelect === undefined || this.couponTotalSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除',  '删除这' + this.couponTotalSelect.length + '项', () => {
        this.couponTotalSelect.forEach( v => {
          this.deleteIds.push(v.id);
        });
        this.couponTotalSrv.deleteCouponInfo({ids: this.deleteIds.join(',')}).subscribe(
        value => {
          console.log(value);
          this.toolSrv.setToast('success', '操作成功', value.message);
          this.couponTotalInitialization();
        }
       );
      });
    }
  }
  // Paging request
  public nowpageEventHandle(event: any): void {
    this.loadingHide = false;
    this.nowPage = event;
    this.couponTotalSrv.queryCouponPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        this.loadingHide = true;
        this.couponTotalTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.couponTotalSelect = [];
  }
  // clear data
  public clearData(): void {
    this.AddcouponTotal = new AddCouponTotal();
    this.couponTypeName = null;
    this.couponMoney = null;
    this.couponEffectiveTime = null;
    this.SearchOption = {village: [], region: [], building: [], unit: [], room: []};
    this.couponSelectOption = [];
    this.roonCodeSelectOption = [];
  }
  public eventClick(e): void {
      console.log(e);
  }
}
