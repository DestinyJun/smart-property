import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {GlobalService} from '../../../common/services/global.service';
import {AddTenant, ModifyTenant, OwerList, RoomTitle, SearchTenant, Tenant} from '../../../common/model/bf-tenant.model';
import {BfTenantinfoService} from '../../../common/services/bf-tenantinfo.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {isObjectFlagSet} from 'tslint';
import {FileOption} from '../../../common/components/basic-dialog/basic-dialog.model';


@Component({
  selector: 'rbi-bf-tenantinfo',
  templateUrl: './bf-tenantinfo.component.html',
  styleUrls: ['./bf-tenantinfo.component.less']
})
export class BfTenantinfoComponent implements OnInit {
  public tenantTableTitle: any;
  public tenantTableContent: Tenant[];
  public tenantTableTitleStyle: any;
  public tenantSelect: any;
  // 查询相关
  public searchTenantData: SearchTenant = new SearchTenant();
  public SearchOption = {village: [], region: [], building: [], unit: []};
  // 添加相关
  public tenantAddDialog: boolean;
  public tenantAdd: AddTenant[] = [];
  public tenantRoomAdd: AddTenant = new AddTenant();
  public roomTitle: RoomTitle = new RoomTitle();
  public tenantList: OwerList[] = [];
  public timeHide = true;
  public tenantTimeDetailHide = true;

  public roomTypeOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public sexOption: any[] = [];
  public owerMoreTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'idNumber', header: '身份证号'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startBillingTime', header: '物业费开始既费时间'},
    {field: 'realRecyclingHomeTime', header: '实际交房时间'},
    {field: 'remarks', header: '备注'},
    {field: 'operating', header: '操作'},
  ];
  public owerMoreDetailTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startBillingTime', header: '物业费开始既费时间'},
    {field: 'remarks', header: '备注'},
  ];
  // 租客信息相关
  public tenantinfo: OwerList = new OwerList();
  public tenantDialog: boolean;
  // 租客信息弹框选择
  public tenantUserSelect: any;
  public normalChargeOption: any[] = [];
  public identityOption: any[] = [];
  // 上传文件相关
  public UploadFileOption: FileOption = new FileOption();
  public uploadRecordOption: any;
  // 修改相关
  public tenantModifayDialog: boolean;
  public tenantModify: ModifyTenant[]  = [];
  public tenantDetailDialog: boolean;
  public tenantDetail: Tenant = new Tenant();
  public roomTypeName: any;
  public roomStatusName: any;
  public renovationStatusName: any;
  public sexName: any;
  // 业主修改相关
  public tenantModifyDialog: any;
  public tenantListIndex: any;
  public villageOption: any[] = [];
  // 上传相
  public tenantInfoDialog: any;
  public uploadOption: any;
  // 其他相关
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  public mobileNumber = '';
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private confirmationService: ConfirmationService,
    private tenantSrv: BfTenantinfoService,
    private toolSrv: PublicMethedService,
    private globalSrv: GlobalService,
    private datePipe: DatePipe,
  ) { }
  ngOnInit() {
    this.tenantInitialization();
  }

  // initialization houseinfo
  public  tenantInitialization(): void {
    this.loadHidden = false;
    // console.log('这里是信息的初始化');
    this.searchTenantData.pageNo = this.nowPage;
    this.searchTenantData.pageSize = 10;
    this.searchTenantData.villageCode = '';
    this.searchTenantData.regionCode = '';
    this.searchTenantData.buildingCode = '';
    this.searchTenantData.unitCode = '';
    // console.log(this.searchTenantData);
    this.tenantSrv.queryTenantDataList(this.searchTenantData).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.loadHidden = true;
          this.tenantTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else  {
          this.loadHidden = true;
          this.toolSrv.setToast('error', '查询失败', value.message);
        }
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          this.villageOption.push({label: v.villageName, value: v.villageName});
        });
      }
    );
    this.esDate = this.toolSrv.esDate;

    this.tenantTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'roomSize', header: '房间大小'},
      // {field: 'roomStatus', header: '房间使用状态'},
      {field: 'operating', header: '操作'}
    ];

    this.tenantTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // village Change
  public  VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.searchTenantData.villageCode = '';
    this.searchTenantData.regionCode = '';
    this.searchTenantData.buildingCode = '';
    this.searchTenantData.unitCode = '';
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.searchTenantData.villageCode = e.value;

    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.loadHidden = true;
          this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
        });
      }
    );
  }
  // region Change
  public  regionChange(e): void {
    this.loadHidden = false;
    this.searchTenantData.regionCode = '';
    this.searchTenantData.buildingCode = '';
    this.searchTenantData.unitCode = '';
    this.searchTenantData.regionCode = e.value;
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
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
  // building Change
  public  buildingChange(e): void {
    this.searchTenantData.buildingCode = '';
    this.searchTenantData.unitCode = '';
    this.SearchOption.unit = [];

    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // unit Change
  public  unitChange(e): void {
    this.searchTenantData.unitCode = '';
    this.searchTenantData.unitCode = e.value;
  }
  // condition search click
  public  tenantSearchClick(): void {
    // @ts-ignore
    if (this.mobileNumber !== '') {
      this.loadHidden = false;
      this.tenantSrv.queryByMobileNumber({pageNo: 1, pageSize: 10, mobileNumber: this.mobileNumber}).subscribe(
        value => {
          if (value.status === '1000') {
            this.loadHidden = true;
            this.tenantTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.toolSrv.setToast('error', '请求错误', value.message);
          }
        }
      );
    } else {
      if ( this.searchTenantData.villageCode !== '' ) {
        this.loadHidden = false;
        this.searchTenantData.pageNo = 1;
        this.tenantSrv.queryTenantInfoList(this.searchTenantData).subscribe(
          (value) => {
            this.loadHidden = true;
            this.tenantTableContent = value.data.contents;
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          }
        );
      } else {
        this.toolSrv.setToast('error', '操作错误', '请选择或输入搜索条件');
      }
    }
  }
  // roomStatus Change
  public  roomStatusChange(e): void {
    if (e.value === '1') {
      this.timeHide = false;
    } else {
      this.timeHide = true;
    }
  }
  // add tenant
  public  tenantAddClick(): void {
    this.roomTitle = new RoomTitle();
    this.roomTitle.villageName = '';
    this.roomTitle.roomCode = '';
    this.roomTitle.regionName = '';
    this.roomTitle.unitName = '';
    this.roomTitle.buildingName = '';
    this.roomTitle.roomStatus = '';
    this.roomTitle.renovationStatus = '';
    this.roomTitle.roomType = '';
    this.roomTitle.roomSize = '';
    this.roomTitle.renovationStartTime = '';
    this.roomTitle.renovationDeadline = '';
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roomTypeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roomStatusOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.renovationStatusOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantAddDialog = true;
  }
  // sure add tenant
  public  tenantAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      if (this.tenantList.length === 0 ) {
        this.tenantSrv.addRoomCodeInfo(this.roomTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tenantAddDialog = false;
              this.clearData();
              this.tenantInitialization();
            } else  {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      } else {
        this.tenantAddDialog = false;
        this.clearData();
        this.tenantInitialization();
        this.toolSrv.setToast('success', '操作成功', '操作成功');
      }
    });
  }
  // delete Tenant
  public  deleteTenantMoreClick(e): void {
    this.tenantSrv.deleteTenantInfo({roomCode: e.roomCode, userId: e.userId}).subscribe(
      value => {
        if (value.status === '1000') {
          this.toolSrv.setToast('success', '请求成功', value.message);
          this.queryTenantInfo(e.roomCode);
        } else {
          this.toolSrv.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // add
  public  addMoreTenantClick(): void {
    this.tenantinfo = new OwerList();
    this.tenantinfo.identity = '';
    this.tenantinfo.startBillingTime = '';
    this.tenantinfo.mobilePhone = '';
    this.tenantinfo.sex = '';
    this.tenantinfo.normalPaymentStatus = '';
    this.tenantinfo.surname = '';
    this.sexOption = [];
    this.normalChargeOption = [];
    this.identityOption = [];
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'SEX'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.sexOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantDialog = true;
  }
  public  tenantInfoAddClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;
      this.tenantAdd = [];
      const list = ['buildingCode', 'unitCode', 'regionCode', 'villageCode'];
      if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
        this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
      }
      if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
        this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
      }
      if (this.tenantinfo.hasOwnProperty('realRecyclingHomeTime') && this.tenantinfo.realRecyclingHomeTime !== '') {
        this.tenantinfo.realRecyclingHomeTime = this.datePipe.transform( this.tenantinfo.realRecyclingHomeTime , 'yyyy-MM-dd');
      }
      for (const key in this.roomTitle) {
        this.tenantRoomAdd[key] = this.roomTitle[key];
      }
      this.tenantinfo.identity = 3;
      for (const key in this.tenantinfo) {
        this.tenantRoomAdd[key] = this.tenantinfo[key];
      }
      if (this.tenantRoomAdd.startBillingTime !== '') {
        this.tenantRoomAdd.startBillingTime = this.datePipe.transform(this.tenantRoomAdd.startBillingTime, 'yyyy-MM-dd');
      }
      this.tenantRoomAdd.roomCode = this.tenantRoomAdd.roomCode.slice(this.tenantRoomAdd.roomCode.lastIndexOf('-') + 1, this.tenantRoomAdd.roomCode.length);
      list.forEach(v => {
        delete this.tenantRoomAdd[v];
      });
      // this.tenantAdd.push(this.tenantRoomAdd);
      // console.log(this.tenantRoomAdd);
      this.tenantSrv.addTenantInfo(this.tenantRoomAdd).subscribe(
        value => {
          // console.log(value);
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '添加成功');
            this.queryTenantInfo(value.data);
            // this.clearData();
            this.tenantDialog = false;
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        });
    });
  }
  // detail tenantInfo
  public  tenantDetailClick(e): void {
    if (e.renovationStatus === '1') {
      this.tenantTimeDetailHide = false;
    } else {
      this.tenantTimeDetailHide = true;
    }
    this.identityOption = [];
    this.sexOption = [];
    this.normalChargeOption = [];
    this.roomTitle = e;
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomType.toString() === v.settingCode) {
            this.roomTypeName = v.settingName;
          }
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomStatus.toString() === v.settingCode) {
            this.roomStatusName = v.settingName;
          }
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.renovationStatus.toString() === v.settingCode) {
            this.renovationStatusName = v.settingName;
          }
        });
      }
    );
    this.queryTenantInfo(this.roomTitle.roomCode);
    this.tenantDetailDialog = true;
  }
  // modify tenant
  public  tenantModifyClick(): void {
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tenantSelect.length === 1) {
      if (this.tenantSelect[0].renovationStatus === '1') {
        this.timeHide = false;
      }else {
        this.timeHide = true;
      }
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.roomTitle.roomType !== null)  {
              if (this.roomTitle.roomType.toString() === v.settingCode) {
                this.roomTypeName = v.settingName;
              }
            }
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomStatusOption.push({label: v.settingName, value: v.settingCode});
            if (this.roomTitle.roomStatus !==  null) {
              if (this.roomTitle.roomStatus.toString() === v.settingCode) {
                this.roomStatusName = v.settingName;
              }
            }
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.renovationStatusOption.push({label: v.settingName, value: v.settingCode});
            if (this.roomTitle.renovationStatus !== null) {
              if (this.roomTitle.renovationStatus.toString() === v.settingCode) {
                this.renovationStatusName = v.settingName;
              }
            }
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'SEX'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.sexOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'IDENTITY'}).subscribe(
        value => {
          value.data.forEach( v => {
            if (v.settingName === '租客')
              this.identityOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      );
      let setTime = setInterval(() => {
          this.tenantSrv.queryTenantInfoDetail({roomCode: this.roomTitle.roomCode}).subscribe(
            value => {
              this.tenantList = [];
              if (value.status === '1000') {
                value.data.forEach( v => {
                  for (const key in  v) {
                    this.tenantinfo[key] =  v[key];
                  }
                  if (this.tenantinfo.sex != null) {
                    this.sexOption.forEach( val => {
                      if (this.tenantinfo.sex.toString() === val.value) {
                        this.tenantinfo.sex = val.label;
                      }
                    });
                  }
                  if (this.tenantinfo.normalPaymentStatus != null) {
                    this.normalChargeOption.forEach( val => {
                      if (this.tenantinfo.normalPaymentStatus.toString() === val.value) {
                        this.tenantinfo.normalPaymentStatus = val.label;
                      }
                    });
                  }
                  if (this.tenantinfo.identity != null) {
                    this.identityOption.forEach(val => {
                      if (this.tenantinfo.identity.toString() === val.value) {
                        this.tenantinfo.identity = val.label;
                      }
                    });
                  }
                  this.tenantList.push(this.tenantinfo);
                  this.tenantinfo = new OwerList();
                });
                clearInterval(setTime);
              }
            }
          );
      }, 400);
      this.tenantModifayDialog = true;
      console.log(this.tenantModify);
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  public  modifyMoreOwerClick(): void {
    for (const tenantinfoKey in this.tenantinfo) {
        if(this.tenantinfo[tenantinfoKey] === null) {
          this.tenantinfo[tenantinfoKey] = '';
        }
    }
    if (this.tenantUserSelect === undefined || this.tenantUserSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tenantUserSelect.length === 1) {
      this.tenantinfo =   this.tenantUserSelect[0];
      this.tenantListIndex = this.tenantList.indexOf(this.tenantinfo);
      this.tenantModifyDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改的项');
    }
  }
  // ower modify
  public  owerInfoModifyClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.loadHidden = false;
      this.tenantAdd = [];
      if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
        this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
      }
      if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
        this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
      }
      if (this.tenantinfo.hasOwnProperty('realRecyclingHomeTime') && this.tenantinfo.realRecyclingHomeTime !== '') {
        this.tenantinfo.realRecyclingHomeTime = this.datePipe.transform( this.tenantinfo.realRecyclingHomeTime , 'yyyy-MM-dd');
      }
      for (const key in this.roomTitle) {
        this.tenantRoomAdd[key] = this.roomTitle[key];
      }
      if (this.tenantinfo.sex != null ) {
        this.sexOption.forEach(val => {
          if (this.tenantinfo.sex === val.label) {
            this.tenantinfo.sex = val.value;
          }
        });
      }
      if (this.tenantinfo.normalPaymentStatus != null)  {
        this.normalChargeOption.forEach(val => {
          if (this.tenantinfo.normalPaymentStatus === val.label) {
            this.tenantinfo.normalPaymentStatus = val.value;
          }
        });
      }
      this.tenantinfo.identity = 3;
      for (const key in this.tenantinfo) {
        this.tenantRoomAdd[key] = this.tenantinfo[key];
      }
      this.tenantRoomAdd.startBillingTime = this.datePipe.transform(this.tenantRoomAdd.startBillingTime, 'yyyy-MM-dd');
      this.tenantRoomAdd.roomCode = this.tenantRoomAdd.roomCode.slice(this.tenantRoomAdd.roomCode.lastIndexOf('-') + 1, this.tenantRoomAdd.roomCode.length);
      delete this.tenantRoomAdd.buildingCode;
      delete this.tenantRoomAdd.unitCode;
      delete this.tenantRoomAdd.regionCode;
      delete this.tenantRoomAdd.villageCode;
      // this.tenantAdd.push(this.tenantRoomAdd);
      this.tenantSrv.addTenantInfo(this.tenantRoomAdd).subscribe(
        value => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '修改成功');
            this.queryTenantInfo(value.data);
            this.tenantUserSelect = [];
            this.tenantModifyDialog = false;
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        });
    });
  }
  // sure modify tenant
  public  tenantModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      if (this.tenantList.length === 0 ) {
        if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
          this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
        }
        if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
          this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
        }
        if (this.tenantinfo.hasOwnProperty('realRecyclingHomeTime') && this.tenantinfo.realRecyclingHomeTime !== '') {
          this.tenantinfo.realRecyclingHomeTime = this.datePipe.transform( this.tenantinfo.realRecyclingHomeTime , 'yyyy-MM-dd');
        }
        this.roomTitle.roomCode = this.roomTitle.roomCode.slice(this.roomTitle.roomCode.lastIndexOf('-') + 1, this.roomTitle.roomCode.length);
        this.tenantSrv.addRoomCodeInfo(this.roomTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tenantModifayDialog = false;
              this.clearData();
              this.tenantInitialization();
            } else  {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      } else {
        this.tenantModifayDialog = false;
        this.clearData();
        this.tenantInitialization();
        this.toolSrv.setToast('success', '操作成功', '操作成功');
      }
    });
  }
  // delete tenant
  public  tenantDeleteClick(): void {
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.tenantSelect.length}项`, () => {
        this.loadHidden = false;
        this.tenantSelect.forEach( v => {
          this.deleteId.push({roomCode: v.roomCode});
        });
        this.tenantSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tenantInitialization();
              this.clearData();
            }
            console.log(value);
          }
        );
      });
    }
  }
  // select houseinfo
  public  tenantonRowSelect(e): void {
    this.roomTitle = e.data;
  }
  // add more info Dialog
  public  AddMoreClick(): void {
    this.UploadFileOption.files = [];
    this.UploadFileOption.dialog = true;
    this.UploadFileOption.width = '800';
  }

  // upload file
  public  tenantUploadSureClick(e): void {
    this.loadHidden = false;
    this.tenantSrv.uploadTenantInfoFile(e).subscribe(
      (value) => {
        if (value.status === '1000') {
          this.loadHidden = true;
          this.UploadFileOption.files = [];
          this.uploadRecordOption = {
            width: '900',
            dialog: true,
            title: '上传记录',
            totalNumber: value.data.totalNumber,
            realNumber: value.data.realNumber,
            uploadOption: {
              width: '102%',
              tableHeader: {
                data: [
                  {field: 'roomCode', header: '房间编号'},
                  {field: 'surname', header: '客户姓氏'},
                  {field: 'phone', header: '客户电话'},
                  {field: 'result', header: '结果'},
                ],
                style: { background: '#F4F4F4', color: '#000', height: '6vh'}
              },
              tableContent: {
                data: value.data.logOwnerInformationDOS,
                styleone: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'},
                styletwo: { background: '#FFFFFF', color: '#000', height: '2vw', textAlign: 'center'}
              }
            }
          };
          this.toolSrv.setToast('success', '上传成功', value.message);
          this.tenantInitialization();
        } else {
          this.toolSrv.setToast('error', '上传失败', value.message);
        }
      }
    );
  }
  public  queryTenantInfo(code): void {
    this.identityOption = [];
    this.sexOption = [];
    this.normalChargeOption = [];
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomType.toString() === v.settingCode) {
            this.roomTypeName = v.settingName;
          }
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomStatus.toString() === v.settingCode) {
            this.roomStatusName = v.settingName;
          }
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.renovationStatus.toString() === v.settingCode) {
            this.renovationStatusName = v.settingName;
            if (this.renovationStatusName === '未装修') {
              this.tenantTimeDetailHide = true;
            } else {
              this.tenantTimeDetailHide = false;
            }
          }
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'SEX'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.sexOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.tenantSrv.queryTenantInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    const setTime = setInterval(() => {
      if (this.sexOption.length > 0 && this.normalChargeOption.length && this.normalChargeOption.length > 0){
        this.tenantSrv.queryTenantInfoDetail({roomCode: code}).subscribe(
          value => {
            this.tenantList = [];
            if (value.status === '1000') {
              value.data.forEach( v => {
                for (const key in  v) {
                  this.tenantinfo[key] = v[key];
                }
                if (this.tenantinfo.sex != null ) {
                  this.sexOption.forEach(val => {
                    if (this.tenantinfo.sex.toString() === val.value.toString()) {
                      this.tenantinfo.sex = val.label;
                    }
                  });
                }
                if (this.tenantinfo.normalPaymentStatus != null)  {
                  this.normalChargeOption.forEach(val => {
                    if (this.tenantinfo.normalPaymentStatus.toString() === val.value.toString()) {
                      this.tenantinfo.normalPaymentStatus = val.label;
                    }
                  });
                }
                this.tenantList.push(this.tenantinfo);
                this.tenantinfo = new OwerList();
              });
              clearInterval(setTime);
            } else {
              clearInterval(setTime);
              this.toolSrv.setToast('error', '操作错误', '用户信息数据错误');
            }
          }
        );
      }
    }, 400);

  }
  public  clearData(): void {
    this.tenantRoomAdd = new AddTenant();
    this.tenantAdd = [];
    this.tenantModify = [];
    // this.SearchOption = {village: [], region: [], building: [], unit: []};
    this.roomTypeOption = [];
    this.roomStatusOption = [];
    this.renovationStatusOption = [];
    this.sexOption = [];
    this.roomTypeName = null;
    this.roomStatusName = null;
    this.renovationStatusName = null;
    this.sexName = null;
    this.tenantSelect = [];
    this.roomTitle = new RoomTitle();
    this.tenantList = [];
    this.tenantinfo = new OwerList();
    this.tenantUserSelect = [];
    this.identityOption = [];
    this.normalChargeOption = [];
  }
  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.searchTenantData.pageNo = this.nowPage;
    if (this.searchTenantData.villageCode !== '' || this.searchTenantData.regionCode !== '' || this.searchTenantData.buildingCode !== '' || this.searchTenantData.unitCode !== '') {
      this.tenantSrv.queryTenantInfoList(this.searchTenantData).subscribe(
        (value) => {
          this.loadHidden = true;

          if (value.data.contents) {
            this.tenantTableContent = value.data.contents;
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      );
    } else {
      this.tenantSrv.queryTenantDataList(this.searchTenantData).subscribe(
        (value) => {
          this.loadHidden = true;
          if (value.status === '1000') {
            if (value.data.contents) {
              this.tenantTableContent = value.data.contents;
            }
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.toolSrv.setToast('error', '操作错误', value.message);
          }
        }
      );
    }
    // this.paymentSelect = [];
  }
  // isOrChinese
  public funcChina(obj) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {
      return false;
    }
    return true;
  }

  public getUploadSuccessInfo(id): void {
    this.tenantSrv.queryUploadDetail({logCode: id}).subscribe(
      value => {
        if (value.status === '1000') {

          this.tenantInfoDialog = true;
        } else {
          this.toolSrv.setToast('error', '查询上传信息失败', value.message);
        }
      }
    );
  }
}
