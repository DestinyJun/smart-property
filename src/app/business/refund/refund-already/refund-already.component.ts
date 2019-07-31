import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RefundAlreadyService} from '../../../common/services/refund-already.service';
import {GlobalService} from '../../../common/services/global.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-refund-already',
  templateUrl: './refund-already.component.html',
  styleUrls: ['./refund-already.component.less']
})
export class RefundAlreadyComponent implements OnInit {


  @ViewChild('input', {static: true}) input: Input;
  public alreadyTableTitle: any;
  public alreadyTableContent: any[];
  public alreadyTableTitleStyle: any;
  public alreadySelect: any[];
  // 添加相关
  public alreadyAddDialog: boolean;
  public alreadyAdd: any;
  public  licensePlateColorOption: any[] = [];
  public  licensePlateTypeOption: any[] = [];
  public  alreadyOriginalTypeOption: any[] = [];
  // 修改相关
  public alreadyModifayDialog: boolean;
  public alreadyModify: any;
  public licensePlateColorModify: any;
  public licensePlateTypeModify: any;
  // 详情相关
  public alreadyDetailDialog: boolean;
  public alreadyDetail: any;

  // public msgs: Message[] = []; // 消息弹窗
  public SearchOption = {
    village: [],
    region: [],
    building: [],
    unit: []
  };
  public deleteIds: any[] = [];
  public option: any;
  public loadHidden = true;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public nowPage = 1;
  public roonCodeSelectOption: any[] = [];

  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private alreadySrv: RefundAlreadyService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
  ) {
  }

  ngOnInit() {
    this.alreadyInitialization();
  }

  // initialization already
  public alreadyInitialization(): void {
    this.alreadyTableTitle = [
      {field: 'orderId', header: '订单Id'},
      {field: 'payerName', header: '缴费人姓名'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'paymentType', header: '支付类型'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'actualMoneyCollection', header: '实收金额'},
      {field: 'operating', header: '操作'},
    ];
    this.loadHidden = false;
    this.toolSrv.getAdminStatus('AUDIT_STATUS', (data) => {
      if (data.length  > 0) {
        this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          val => {
            this.loadHidden = true;
            if (val.status === '1000') {
              val.data.contents.forEach( h => {
                data.forEach( v => {
                  // console.log();
                  if (h.auditStatus.toString() === v.settingCode) {
                    h.auditStatus = v.settingName;
                  }
                });
              });
              this.alreadyTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            } else {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );
      } else {
        this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          val => {
            if (val.status === '1000') {
              this.loadHidden = true;
              this.alreadyTableContent = val.data.contents;
              this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};
            }  else {
              this.toolSrv.setToast('error', '请求失败', val.message);
            }
          }
        );
      }
    });
/*    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach(v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );*/
    this.alreadyTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
/*  // village change
  public VillageChange(e): void {
    this.loadHidden = false;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.alreadyAdd.villageName = e.originalEvent.target.innerText;
    this.alreadyModify.villageName = e.originalEvent.target.innerText;
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
    this.alreadyAdd.regionName = e.originalEvent.target.innerText;
    this.alreadyModify.regionName = e.originalEvent.target.innerText;
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
        });
        this.loadHidden = true;

      }
    );
  }
  public buildingChange(e): void {
    this.SearchOption.unit = [];
    this.alreadyAdd.buildingName = e.originalEvent.target.innerText;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach(v => {
          this.SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  public unitChange(e): void {
    this.alreadyAdd.unitName = e.originalEvent.target.innerText;
  }*/
  // condition search click
  public alreadySearchClick(): void {
    // @ts-ignore
    // console.log(this.input.nativeElement.value);
    // console.log('这里是条件搜索');
  }
  // Show refunded details dialog
  public alreadyDetailClick(e): void {
    this.alreadyDetail = e;
    this.alreadyDetailDialog = true;

  }
  // already select
  public  alreadyonRowSelect(e): void {
    this.alreadyModify = e.data;
  }
  // Reset data
  public clearData(): void {
    this.alreadyAdd = null;
    this.alreadyModify = null;
    this.licensePlateColorModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateTypeModify = null;
    this.licensePlateColorOption = [];
    this.licensePlateTypeOption = [];
    this.alreadyOriginalTypeOption = [];
    this.alreadySelect = [];
  }
  // paging query
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.alreadySrv.queryRefundAlreadyPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.alreadyTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
}
