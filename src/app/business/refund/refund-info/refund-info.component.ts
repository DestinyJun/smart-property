import {Component, Input, OnInit, ViewChild} from '@angular/core';
// import {Addinfo, Modifyinfo, info} from '../../../common/model/bf-info.model';
import {ConfirmationService, MessageService} from 'primeng/api';
// import {BfinfoService} from '../../../common/services/bf-info.service';
import {GlobalService} from '../../../common/services/global.service';
import {RefundInfoService} from '../../../common/services/refund-info.service';
import {AddressInfo} from 'dgram';
import {AddRefundInfo, ModifyRefundInfo, RefundInfo, SearchRefundInfo} from '../../../common/model/refund-info.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'rbi-refund-info',
  templateUrl: './refund-info.component.html',
  styleUrls: ['./refund-info.component.less']
})
export class RefundInfoComponent implements OnInit {


  @ViewChild('input') input: Input;
  public infoTableTitle: any;
  public infoTableContent: any[];
  public infoTableTitleStyle: any;
  public infoSelect: any[];
  // 添加相关
  public infoAddDialog: boolean;
  public infoAdd: AddRefundInfo = new AddRefundInfo();
  public ChargeSelectOption: any[] = [];
  public paymentSelectOption: any[] = [];
  public ChargetOption: any[] = [];
  public ChargetTypeName: any;
  // 修改相关
  public infoModifayDialog: boolean;
  public infoModify: ModifyRefundInfo = new ModifyRefundInfo();
  // 详情相关
  public infoDetailDialog: boolean;
  public infoDetail: ModifyRefundInfo = new ModifyRefundInfo();
  public refundStatusDetail: any;
  public paymentTypeDetail: any;
  // 条件查询
  public searchRefundInfo: SearchRefundInfo = new SearchRefundInfo();
  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public esDate: any;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private infoSrv: RefundInfoService,
    private globalSrv: GlobalService,
    private datePipe: DatePipe,

  ) {
  }

  ngOnInit() {
    this.infoInitialization();
  }

  // initialization info
  public infoInitialization(): void {
    console.log('这里是信息的初始化');
    this.infoTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      // {field: 'paymentType', header: '支付类型'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'refundStatus', header: '退款状态'},
      {field: 'operating', header: '操作'},
    ];
    this.esDate = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      today: '今天',
      clear: '清除'
    };
    this.loadHidden = false;
    this.infoSrv.queryRefundStatus({settingType: 'REFUND_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          this.infoSrv.queryRefundInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              this.loadHidden = true;
              if (val.status === '1000') {
                val.data.contents.forEach( h => {
                  value.data.forEach(v => {
                    if (h .refundStatus.toString() === v.settingCode) {
                         h.refundStatus = v.settingName;
                    }
                  });
                });
                console.log(val);
                this.infoTableContent = val.data.contents;
                this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
              } else {
                this.setToast('error', '请求失败', val.message);
              }
            }
          );
        } else {
          this.infoSrv.queryRefundInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
            val => {
              this.loadHidden = true;
              console.log(val);
              this.infoTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            }
          );
        }
      }
    );

    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
      }
    );
    this.infoTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.infoSelect);

  }

  // village change
  public VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.searchRefundInfo.villageCode = e.value;
    this.searchRefundInfo.buildingCode = '';
    this.searchRefundInfo.regionCode = '';
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    this.infoAdd.villageName = e.originalEvent.target.innerText;
    // this.infoAdd.villageCode = e.value;
    this.infoModify.villageName = e.originalEvent.target.innerText;
    // this.infoModify.villageCode = e.value;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.loadHidden = true;
          this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public regionChange(e): void {
    this.loadHidden = false;
    this.SearchOption.unit = [];
    this.infoAdd.regionName = e.originalEvent.target.innerText;
    // this.infoAdd.regionCode = e.value;
    this.infoModify.regionName = e.originalEvent.target.innerText;
    // this.infoModify.regionCode = e.value;
    this.searchRefundInfo.regionCode = e.value;
    this.searchRefundInfo.buildingCode = '';
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.infoAdd.buildingName = e.originalEvent.target.innerText;
    this.searchRefundInfo.buildingCode = e.value;
    this.searchRefundInfo.unitCode = '';
    this.searchRefundInfo.roomCode = '';
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    console.log(e.value);
    this.infoAdd.unitName = e.originalEvent.target.innerText;
    this.searchRefundInfo.unitCode = e.value;
    this.searchRefundInfo.roomCode = '';
    this.infoSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // condition search click
  public infoSearchClick(): void {
    // @ts-ignore
    console.log(this.searchRefundInfo);
    if (this.searchRefundInfo.buildingCode === '' && this.searchRefundInfo.mobilePhone === undefined) {
      this.setToast('error', '搜索失败', '搜索信息条件请具体到楼栋');
    } else {
      this.searchRefundInfo.pageNo = 1;
      this.searchRefundInfo.pageSize = 10;
      // @ts-ignore
      this.loadHidden = false;
      console.log(this.searchRefundInfo);
      this.infoSrv.queryRefundInfoPage(this.searchRefundInfo).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.loadHidden = true;
            if (value.data.contents) {
              this.setToast('success', '搜索成功', value.message);

              this.infoTableContent = value.data.contents;
            } else {
              this.setToast('success', '搜索成功', '数据为空');
            }
          } else {
            this.setToast('error', '搜索失败', value.message);

          }
        }
      );
    }
  }
  // search userInfo
  public getUserInfo(): void {
    if (this.infoAdd.mobilePhone !== null) {
      this.infoSrv.quertyUserInfo({mobilePhone: this.infoAdd.mobilePhone}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            this.infoAdd.surname = value.data.surname;
            this.infoAdd.userId = value.data.userId;
          } else {
            this.setToast('error', '请求错误', value.message);
          }
        }
      );
    }
  }
  public  chargeSelectChange(e): void {
    this.infoAdd.chargeCode = e.value;
    this.ChargetOption.forEach( v => {
      if (e.value === v.value) {
        this.infoAdd.chargeName = v.label;
        this.infoAdd.chargeUnit = v.chargeUnit;
        this.infoAdd.chargeType = v.chargeType;
        this.infoAdd.chargeStandard = v.chargeStandard;
      }
    });
    this.infoSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.infoAdd.chargeType.toString() === v.settingCode) {
              this.ChargetTypeName = v.settingName;
            }
          });
        }
      }
    );
    this.infoSrv.queryRefundStatus({settingType: 'PAYMENT_METHOD'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.paymentSelectOption.push({label: v.settingName, value: v.settingName});
          });
        }
      }
    );
  }
  // add info
  public infoAddClick(): void {
    this.infoSrv.quertyChargeInfo({}).subscribe(
      value => {
        if (value.data.length !== 0) {
          value.data.forEach(v => {
            this.ChargetOption.push({label: v.chargeName, value: v.chargeCode, chargeUnit: v.chargeUnit, chargeType: v.chargeType, chargeStandard: v.chargeStandard, refund: v.refund });
            this.ChargeSelectOption.push({label: v.chargeName, value: v.chargeCode});
          });
        }
      }
    );
    this.infoAddDialog = true;
  }
  // sure add info
  public infoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.infoAdd.startTime = this.datePipe.transform(this.infoAdd.startTime, 'yyyy-MM-dd');
        this.infoAdd.dueTime = this.datePipe.transform(this.infoAdd.dueTime, 'yyyy-MM-dd');
        this.infoSrv.addRefundInfo(this.infoAdd).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', value.message);
              this.clearData();
              this.infoAddDialog = false;
              this.infoInitialization();
            }
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
  //  info detail
  public infoDetailClick(e): void {
    this.infoDetail = e;
    this.infoSrv.queryRefundStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.infoDetail.paymentType.toString() === v.settingCode) {
              this.paymentTypeDetail = v.settingName;
            }
          });
        }
      }
    );
    this.infoSrv.queryRefundStatus({settingType: 'REFUND_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.infoDetail.refundStatus.toString() === v.settingCode) {
              this.refundStatusDetail = v.settingName;
            }
          });
        }
      }
    );
    this.infoDetailDialog = true;

  }
  // info select
  public  infoonRowSelect(e): void {
    this.infoModify = e.data;
    console.log(e.data);
  }
  // modify info
  public infoModifyClick(): void {
    if (this.infoSelect === undefined || this.infoSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.infoSelect.length === 1) {
      if (this.infoModify.refundStatus === 0){
        this.infoSrv.quertyChargeInfo({}).subscribe(
          value => {
            console.log(value);
            if (value.data.length !== 0) {
              value.data.forEach(v => {
                this.ChargetOption.push({label: v.chargeName, value: v.chargeCode, chargeUnit: v.chargeUnit, chargeType: v.chargeType, chargeStandard: v.chargeStandard, refund: v.refund });
                this.ChargeSelectOption.push({label: v.chargeName, value: v.chargeCode});
              });
            }
            console.log(value);
          }
        );
        this.globalSrv.queryRegionInfo({villageCode: this.infoModify.villageCode}).subscribe(
          (value) => {
            console.log(value);
            value.data.forEach(v => {
              this.loadHidden = true;
              this.SearchOption.region.push({label: v.regionName, value: v.regionCode});
            });
          }
        );
        this.globalSrv.queryBuilingInfo({regionCode: this.infoModify.regionCode}).subscribe(
          (value) => {
            console.log(value);
            value.data.forEach(v => {
              this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
            });
            this.loadHidden = true;

          }
        );
        this.globalSrv.queryunitInfo({buildingCode: this.infoModify.buildingCode}).subscribe(
          (value) => {
            console.log(value);
            value.data.forEach(v => {
              this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
            });
          }
        );
        this.infoSrv.queryRoomCode({unitCode: this.infoModify.unitCode}).subscribe(
          value => {
            console.log(value);
            value.data.forEach( v => {
              this.roonCodeSelectOption.push({label: v.roomCode, value: v.roomCode});
            });
          }
        );
        this.infoModifayDialog = true;
      } else {
        this.setToast('error', '操作错误', '改订单正在退款中或已退款,不能修改');
      }
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }

  // sure modify info
  public infoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.infoModify.startTime = this.datePipe.transform(this.infoModify.startTime, 'yyyy-MM-dd');
        this.infoModify.dueTime = this.datePipe.transform(this.infoModify.dueTime, 'yyyy-MM-dd');
        console.log(this.infoModify);
        this.infoSrv.updateRefundInfo(this.infoModify).subscribe(
          value => {
            if (value.status === '1000') {
              this.setToast('success', '操作成功', '修改成功');
              this.infoModifayDialog = false;
              this.clearData();
              this.infoInitialization();
            }
          }
        );
      },
      reject: () => {

      }
    });
  }

  // delete info
  public infoDeleteClick(): void {
    if (this.infoSelect === undefined || this.infoSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.infoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.infoSelect.forEach( v => {
            this.deleteIds.push(v.id);
          });
          this.infoSrv.deleteRefundInfo({ids: this.deleteIds.join(',')}).subscribe(
            value => {
              if (value.status === '1000' ) {
                this.setToast('success', '操作成功', value.message);
                this.clearData();
                this.infoInitialization();
              }
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
  public setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  public clearData(): void {
    this.infoAdd = new AddRefundInfo();
    this.infoModify = new ModifyRefundInfo();
    this.infoSelect = [];
    this.ChargeSelectOption = [];
    this.paymentSelectOption = [];
    this.ChargetOption = [];
    this.ChargetTypeName = null;
    this.SearchOption = {
      village: [],
      region: [],
      building: [],
      unit: [],
      room: []
    };
  }

  // 分页请求
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.infoSrv.queryRefundInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.infoTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
