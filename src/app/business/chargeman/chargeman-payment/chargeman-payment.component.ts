import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {forEach} from '@angular/router/src/utils/collection';
import {ChargePaymentService} from '../../../common/services/charge-payment.service';
import {
  ChargeItem,
  ChargeItemData,
  ChargeItemDetail,
  ChargeItems,
  ChargePaymentAddOrder,
  Patyment, SearchData
} from '../../../common/model/charge-payment.model';
import {environment} from '../../../../environments/environment';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-chargeman-payment',
  templateUrl: './chargeman-payment.component.html',
  styleUrls: ['./chargeman-payment.component.less'],
})
export class ChargemanPaymentComponent implements OnInit {

  @ViewChild('input') input: Input;
  public paymentTableTitle = [
    {field: 'id', header: '序号'},
    {field: 'roomCode', header: '房间号'},
    {field: 'roomSize', header: '建筑面积'},
    {field: 'surname', header: '客户名称'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'dueTime', header: '物业费到期时间'}];
  public paymentTableContent: any;
  public paymentTableTitleStyle: any;
  public paymentDialogTableTitle = [
    {field: 'chargeName', header: '项目名称'},
    {field: 'chargeStandard', header: '标准单价'},
    {field: 'datedif', header: '月/张数'},
    {field: 'discount', header: '折扣'},
    {field: 'startTime', header: '开始期间'},
    {field: 'dueTime', header: '结束期间'},
    {field: 'amountReceivable', header: '应收金额'},
    {field: 'actualMoneyCollection', header: '实收金额'},
    // {field: 'totle', header: '合计'},
  ];
  public addPayProject = false;
  public paymentSelect: Patyment[];
  // 收费项目选择确认查找详细数据
  public payItemDetail: ChargeItemData = new ChargeItemData();
  // public payItem: ChargeItems[] = [];
  public  SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: [],
    room: [],
  };
  public SearchData: SearchData = new SearchData();
  // 缴费相关
  public projectSelectDialog: boolean;
  public paymentDialog: boolean;
  public paymentTotle = 0; // 总计金额
  public paymentActualTotal = 0; // 实收总计
  public paymentMoney = 0; //
  public Balance = 0;
  // public paymentTotle = 0;
  // 初始化项目
  public paymentProject: ChargeItem[] = [];
  public paymentItemData: ChargeItemDetail[] = [];
  public paymentAddTitle =  [
    {name: '房间代码', value: '', label: 'roomCode'},
    {name: '建筑面积', value: '', label: 'roomSize'},
    {name: '客户名称', value: '', label: 'surname'},
    {name: '手机号码', value: '', label: 'mobilePhone'},
    {name: '物业费到期时间', value: '', label: 'dueTime'},
  ];
  // 查询相关
  public SearchConditions = {
    title: [{name: '小区' , option: [
        {label: '云城商品', value: '1'},
        {label: '未来城', value: '2'},
      ]}, {name: '地块',  option: [
        {label: 'A3', value: '1'},
        {label: 'A4', value: '2'},
        {label: 'A5', value: '3'},
      ]}, {name: '楼栋',  option: [
        {label: '15栋', value: '1'},
        {label: '13栋', value: '2'},
        {label: '14栋', value: '3'},
      ]}, {name: '单元' , option: [
        {label: '一单元', value: '1'},
        {label: '二单元', value: '2'},
        {label: '三单元', value: '3'},
      ]}],
  };
  public optonDialog = [
    {label: '微信', value: '微信'},
    {label: '支付宝', value: '支付宝'},
    {label: '现金', value: '现金'},
    {label: '刷卡', value: '刷卡'},
  ];
  public nowPage = 1;
  public paymentOrderAdd: ChargePaymentAddOrder  = new ChargePaymentAddOrder();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public phoneErrorToast = true;
  public loadHidden = true;
  // ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private paymentSrv: ChargePaymentService,
    private globalSrv: GlobalService,
  ) { }
  ngOnInit() {

    this.paymentInitialization();
  }
  // initialization payment
  public  paymentInitialization(): void {
    this.loadHidden = false;
    console.log('这里是信息的初始化');
    this.paymentTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.paymentSelect);
    this.paymentSrv.searchPaymentData({pageNo: this.nowPage , pageSize: 10}).subscribe(
      (value) => {
        console.log(value);
        if (value.status === '1000') {
          this.loadHidden = true;
          if (value.data.contents) {
            this.paymentTableContent = value.data.contents;
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.setToast('error', '请求错误', value.message);
        }
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );
  }
  // condition search click
  public  paymentSearchClick(): void {
    if (this.SearchData.buildingCode !== '') {
      this.SearchData.pageNo = 1;
      this.SearchData.pageSize = 10;
      // @ts-ignore
      this.loadHidden = false;
      console.log(this.SearchData);
      this.paymentSrv.searchPaymentData(this.SearchData).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadHidden = true;
            if (value.data.contents) {
              this.setToast('success', '搜索成功', value.message);
              this.paymentTableContent = value.data.contents;
            } else {
              this.setToast('success', '搜索成功', '数据为空');
            }
          } else {
            this.setToast('error', '搜索失败', value.message);

          }
        }
      );
    } else {
      this.setToast('error', '搜索失败', '搜索信息条件请具体到楼栋');

    }

    console.log('这里是条件搜索');
  }
  public  VillageChange(e): void {
    // console.log(this.test);
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.SearchOption.region = [];
    this.SearchData.villageCode = e.value;
    this.loadHidden = false;
    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.loadHidden = true;
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  public  regionChange(e): void {
    this.loadHidden = false;
    this.SearchData.regionCode = '';
    this.SearchData.buildingCode = '';
    this.SearchData.unitCode = '';
    this.SearchData.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public  buildingChange(e): void {
    this.SearchData.buildingCode = '';
    this.SearchData.unitCode = '';
    this.SearchOption.unit = [];
    this.SearchData.buildingCode = e.value;
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
    this.SearchData.roomCode = '';
    this.SearchData.unitCode = e.value;
    this.globalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        value.data.forEach( v => {
          this. SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // sure selectPreject payment
  public  paymentProjectSureClick(): void {
    let monthStatus = true;
    let monthCheckStatus = false;
    // Judge whether to choose（判断是否选择收费项）
    this.paymentProject.forEach(v => {
      if (v.check === 1) {
        monthCheckStatus = true;
      }
    });
    // Determine if the month is empty(判断月份是否为空)
    this.paymentProject.forEach(v => {
      if (v.check === 1) {
        if (v.chargeWay === 1) {
          // console.log(v.datedif);
          if (v.datedif === '' || v.datedif === null) {
            this.setToast('error', '操作错误', '请选择月份' );
            monthStatus = false;
          }
        }
      }
    });

    if (!monthCheckStatus) {
      this.projectSelectDialog = true;
      this.setToast('error', '操作错误', '请选择收费项目' );
    } else {
      if (monthStatus) {
        this.loadHidden = false;
        this.paymentDialog = true;
        this.projectSelectDialog = false;
        // console.log(this.paymentProject);
        this.paymentAddTitle.forEach(item => {
            item.value = this.paymentSelect[0][item.label];
          }
        );
        this.payItemDetail.dueTime = this.paymentSelect[0].dueTime;
        this.payItemDetail.roomSize = this.paymentSelect[0].roomSize;
        this.payItemDetail.chargeItem = [];
        this.paymentProject.forEach(value => {
          if (value.check === 1) {
            this.payItemDetail.chargeItem.push({chargeCode: value.chargeCode, chargeName: value.chargeName, chargeType: value.chargeType, datedif: value.datedif});
          }
        });
        console.log(this.payItemDetail);
        this.paymentSrv.searchChargeItemDetail(this.payItemDetail).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '1000') {
              this.paymentItemData = value.data;
              // console.log(this.paymentItemData);
              this.loadHidden = true;

              this.paymentTotle = 0;
              this.paymentItemData.forEach( v => {
                this.paymentTotle = this.paymentTotle + v.actualMoneyCollection;
                this.paymentActualTotal = this.paymentActualTotal + v.amountReceivable;
              });
              this.paymentMoney = this.paymentTotle;
            } else {
              this.setToast('error', '操作错误', value.messsage);
            }
          }
        );

      }
    }
    console.log(this.paymentSelect[0]);
  }
  // sure modify payment
  public  paymentSureClick(): void {

    if (this.paymentOrderAdd.paymentMethod === undefined || this.paymentOrderAdd.payerName === undefined || this.paymentOrderAdd.payerPhone === undefined) {
        this.setToast('error', '填写错误', '有数据没填写或者选择');
    } else {
      if (this.phoneErrorToast) {
        this.loadHidden = false;
        // this.paymentOrderAdd.roomSize = this.paymentSelect[0].roomSize;
        this.paymentOrderAdd.organizationId = this.paymentSelect[0].organizationId;
        this.paymentOrderAdd.organizationName = this.paymentSelect[0].organizationName;
        this.paymentOrderAdd.villageName = this.paymentSelect[0].villageName;
        this.paymentOrderAdd.villageCode = this.paymentSelect[0].villageCode;
        this.paymentOrderAdd.villageName = this.paymentSelect[0].villageName;
        this.paymentOrderAdd.regionCode = this.paymentSelect[0].regionCode;
        this.paymentOrderAdd.regionName = this.paymentSelect[0].regionName;
        this.paymentOrderAdd.buildingCode = this.paymentSelect[0].buildingCode;
        this.paymentOrderAdd.buildingName = this.paymentSelect[0].buildingName;
        this.paymentOrderAdd.unitCode = this.paymentSelect[0].unitCode;
        this.paymentOrderAdd.unitName = this.paymentSelect[0].unitName;
        this.paymentOrderAdd.roomCode = this.paymentSelect[0].roomCode;
        this.paymentOrderAdd.roomSize = this.paymentSelect[0].roomSize;
        this.paymentOrderAdd.surname = this.paymentSelect[0].surname;
        this.paymentOrderAdd.mobilePhone = this.paymentSelect[0].mobilePhone;
        this.paymentOrderAdd.amountTotalReceivable = this.paymentActualTotal;
        this.paymentOrderAdd.actualTotalMoneyCollection = this.paymentTotle;
        this.paymentOrderAdd.userId = this.paymentSelect[0].userId;
        this.paymentOrderAdd.chargeItemCostDTO = this.paymentItemData;
        this.paymentOrderAdd.surplus = this.Balance;
        console.log(this.paymentOrderAdd);
        this.paymentSrv.addPayOrder(this.paymentOrderAdd).subscribe(
          (value) => {
            console.log(value);
            this.loadHidden = true;

            if (value.status === '1000') {
              this.confirmationService.confirm({
                message: `是否打印单据吗？`,
                header: '缴费成功',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                  this.paymentSrv.getPayDocument({orderId: value.data.orderId, organizationId: value.data.organizationId}).subscribe(
                    (data) => {
                      console.log(data);
                      if (data.data !== '') {
                        window.open(data.data);
                        this.paymentDialog = false;
                        this.InitializationAllpayData();
                        // this.setToast('success', '操作成功', data.message);

                      } else {
                        this.setToast('error', '操作失败', data.message);
                      }
                    }
                  );
                },
                reject: () => {
                  this.paymentDialog = false;
                  this.InitializationAllpayData();
                }
              });
            } else {
              this.setToast('error', '请求错误', value.message);
            }
          }
        );
      } else {
        this.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
      }
    }
  }
  // delete payment
  public  paymentClick(): void {

    if (this.paymentSelect === undefined || this.paymentSelect.length === 0 ) {
      this.setToast('error', '请求错误', '请选择需要缴费的项');
    } else if (this.paymentSelect.length === 1) {
      this.loadHidden = false;

      this.paymentSrv.searchChargeItem({roomCode: this.paymentSelect[0].roomCode}).subscribe(
        (value) => {
          console.log(value);
          value.data.forEach( v => {
              let flag = true;
              this.paymentProject.forEach(item => {
                if (v.chargeName === item.chargeName) {
                  flag = false;
                }
              });
              if (flag) {
                this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: '', chargeWay: v.chargeWay, check: 0});
              }
            }
          );
          this.projectSelectDialog = true;
          this.loadHidden = true;
        }
      );
    } else {
      this.setToast('error', '请求错误', '只能选择一项进行缴费');
    }
  }
  // select payment
  public  projectChange(i): void {
    if (this.paymentProject[i].check === 0) {
      this.paymentProject[i].check = 1;
    } else {
      this.paymentProject[i].check = 0;
    }
  }
  // add payment Project
  public  paymentAddProjectClick(): void {
    this.addPayProject = true;
    this.projectSelectDialog = true;
    this.loadHidden = false;
    this.paymentSrv.searchChargeItem({roomCode: this.paymentSelect[0].roomCode}).subscribe(
      (value) => {
        value.data.forEach( v => {
          let flag = true;
          this.paymentProject.forEach(item => {
              if (v.chargeName === item.chargeName) {
                flag = false;
              }
          });
          if (flag) {
              this.paymentProject.push({chargeCode: v.chargeCode, chargeName: v.chargeName, chargeType: v.chargeType, datedif: '', chargeWay: v.chargeWay, check: 0});
          }
          this.loadHidden = true;
        }
       );
      }
    );
    // this.paymentDialog = true;
  }
  public  paymentFaleseClick(): void {
    this.paymentDialog = false;
    this.InitializationAllpayData();

  }
  public  payTypeChage(e): void {
      // console.log(e);
      this.paymentOrderAdd.paymentMethod = e.value;
  }
  public  getBalance(e): void {
    console.log(e.target.value);
    if (e.target.value >= this.paymentTotle) {
      this.Balance = parseFloat(( e.target.value - this.paymentTotle).toFixed(2));
    }
  }
  public  payProjectFalseClick(): void {
    if (this.addPayProject) {
      this.addPayProject = false;
      this.projectSelectDialog = false;

    } else {
      this.InitializationAllpayData();
      this.loadHidden = false;
      this.projectSelectDialog = false;
    }
  }
  // Toast
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

  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.paymentSrv.searchPaymentData({pageNo: event , pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;

        if (value.data.contents) {
          this.paymentTableContent = value.data.contents;
        }
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.paymentSelect = [];
  }
  public paymentPhoneChange(e): void {
      console.log();
      if (e.length !== '' && e.length < 11 || isNaN(e)) {
        this.setToast('error', '手机号码格式错误', '请重新输入11位手机号码');
        this.phoneErrorToast = false;
      } else {
        this.phoneErrorToast = true;
      }

  }
  public  InitializationAllpayData(): void {
    this.paymentItemData = [];
    // this.paymentDialog = false;
    this.paymentTotle = 0;
    this.payItemDetail = new ChargeItemData();
    this.paymentOrderAdd = new ChargePaymentAddOrder();
    this.Balance = 0;
    this.paymentSelect = [];
    this.paymentInitialization();
    this.payItemDetail = new ChargeItemData();
    this.paymentProject = [];
  }
}

