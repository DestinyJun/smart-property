import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {GlobalService} from '../../../common/services/global.service';
import {AddTenant, ModifyTenant, OwerList, RoomTitle, SearchTenant, Tenant} from '../../../common/model/bf-tenant.model';
import {BfTenantinfoService} from '../../../common/services/bf-tenantinfo.service';


@Component({
  selector: 'rbi-bf-tenantinfo',
  templateUrl: './bf-tenantinfo.component.html',
  styleUrls: ['./bf-tenantinfo.component.less']
})
export class BfTenantinfoComponent implements OnInit {
  @ViewChild('input') input: Input;
  // @ViewChild('file') file: Input;
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
    {field: 'normalPaymentStatus', header: '是否正常缴费'},
    {field: 'startBillingTime', header: '物业费开始既费时间'},
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
  // 业主信息相关
  public tenantinfo: OwerList = new OwerList();
  public tenantDialog: boolean;
  // 租客信息弹框选择
  public tenantUserSelect: any;
  public normalChargeOption: any[] = [];
  public identityOption: any[] = [];
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
  // 上传相关
  public tenantUploadFileDialog: boolean;
  public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tenantSrv: BfTenantinfoService,
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
        console.log(value);
        if (value.status === '1000') {
          this.loadHidden = true;
          this.tenantTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else  {
          this.loadHidden = true;
          this.setToast('error', '查询失败', value.message);
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
        console.log(value);
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
        console.log(value);
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
    if ( (this.input.nativeElement.value !== undefined && this.input.nativeElement.value !== '') || this.searchTenantData.villageCode !== '' ) {
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
      this.setToast('error', '操作错误', '请选择或输入搜索条件');
    }
  }
  // roomStatus Change
  public  roomStatusChange(e): void {
    console.log(e);
    if (e.value === '1') {
      this.timeHide = false;
      this.roomTitle.renovationStartTime = '';
      this.roomTitle.renovationDeadline = '';
    } else {
      this.timeHide = true;
      this.roomTitle.renovationStartTime = '1999-12-12';
      this.roomTitle.renovationDeadline = '1999-12-12';
    }
  }
  // add tenant
  public  tenantAddClick(): void {
    this.roomTitle = new RoomTitle();
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
    console.log('这里是添加信息');
  }
  // sure add tenant
  public  tenantAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.tenantList.length === 0 ) {
          this.tenantSrv.addRoomCodeInfo(this.roomTitle).subscribe(
            value => {
              console.log(value);
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.tenantAddDialog = false;
                this.clearData();
                this.tenantInitialization();
              } else  {
                this.setToast('error', '操作失败', value.message);
              }
            }
          );
        } else {
          this.tenantAddDialog = false;
          this.clearData();
          this.tenantInitialization();
          this.setToast('success', '操作成功', '操作成功');
        }
      },
      reject: () => {
      }
    });
  }

  // delete Tenant
  public  deleteTenantMoreClick(e): void {
    console.log(e.userId);
    this.tenantSrv.deleteTenantInfo({roomCode: e.roomCode, userId: e.userId}).subscribe(
      value => {
        console.log(value);
        if (value.status === '1000') {
          this.setToast('success', '请求成功', value.message);
          this.queryTenantInfo(e.roomCode);
        } else {
          this.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  // add
  public  addMoreTenantClick(): void {
    this.tenantinfo = new OwerList();
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
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let flagBole = true;
        for (const key in this.roomTitle) {
          if (this.roomTitle[key] === '') {
            flagBole = false;
          }
        }
        if (flagBole) {
          this.loadHidden = false;
          this.tenantAdd = [];
          if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
            this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
          }
          if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
            this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
          }
          for (const key in this.roomTitle) {
            this.tenantRoomAdd[key] = this.roomTitle[key];
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
          this.tenantAdd.push(this.tenantRoomAdd);
          console.log(this.tenantAdd);
          this.tenantSrv.addTenantInfo({data: this.tenantAdd}).subscribe(
            value => {
              console.log(value);
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', '添加成功');
                this.queryTenantInfo(value.data);
                // this.clearData();
                this.tenantDialog = false;
              } else {
                this.setToast('error', '操作失败', value.message);
              }
            });
        } else  {
          this.setToast('error', '操作错误', '请填写完整的房屋信息');
        }
      },
      reject: () => {
      }
    });
  }
  // detail tenantInfo
  public  tenantDetailClick(e): void {
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
            if (this.renovationStatusName === '未装修') {
              this.tenantTimeDetailHide = true;
            } else {
              this.tenantTimeDetailHide = false;
            }
          }
        });
      }
    );
    this.queryTenantInfo(this.roomTitle.roomCode);
    // if (this.renovationStatusName === '未装修') {
    //
    // }
    this.tenantDetailDialog = true;
  }
  // modify tenant
  public  tenantModifyClick(): void {
    console.log(this.tenantSelect);
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tenantSelect.length === 1) {
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.roomTitle.roomType.toString() === v.settingCode) {
              this.roomTypeName = v.settingName;
            }
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomStatusOption.push({label: v.settingName, value: v.settingCode});

            if (this.roomTitle.roomStatus.toString() === v.settingCode) {
              this.roomStatusName = v.settingName;
            }
          });
        }
      );
      this.tenantSrv.queryTenantInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.renovationStatusOption.push({label: v.settingName, value: v.settingCode});

            if (this.roomTitle.renovationStatus.toString() === v.settingCode) {
              this.renovationStatusName = v.settingName;
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
        if (this.sexOption.length > 0 && this.normalChargeOption.length && this.normalChargeOption.length > 0){
          this.tenantSrv.queryTenantInfoDetail({roomCode: this.roomTitle.roomCode}).subscribe(
            value => {
              console.log(value);
              this.tenantList = [];
              if (value.status === '1000') {
                value.data.forEach( v => {
                  for (const key in  v) {
                    this.tenantinfo[key] =  v[key];
                  }
                  if (this.tenantinfo.sex != null){
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
        }
      }, 400);
      this.tenantModifayDialog = true;
      console.log(this.tenantModify);
    } else {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '只能选择一项进行修改'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    }
  }
  public  modifyMoreOwerClick(): void {
    if (this.tenantUserSelect === undefined || this.tenantUserSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tenantUserSelect.length === 1) {
      this.tenantinfo =   this.tenantUserSelect[0];
      this.tenantListIndex = this.tenantList.indexOf(this.tenantinfo);
      this.tenantModifyDialog = true;
    } else {
      this.setToast('error', '操作错误', '只能选择一项进行修改的项');
    }
  }
  // ower modify
  public  owerInfoModifyClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let flagBole = true;
        for (const key in this.roomTitle) {
          if (this.roomTitle[key] === '') {
            flagBole = false;
          }
        }
        if (flagBole) {
          this.loadHidden = false;
          this.tenantAdd = [];
          if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
            this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
          }
          if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
            this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
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
              if (this.tenantinfo.normalPaymentStatus=== val.label) {
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
          this.tenantAdd.push(this.tenantRoomAdd);
          console.log(this.tenantAdd);
          this.tenantSrv.addTenantInfo({data: this.tenantAdd}).subscribe(
            value => {
              console.log(value);
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', '添加成功');
                this.queryTenantInfo(value.data);
                this.tenantUserSelect = [];
                this.tenantModifyDialog = false;
              } else {
                this.setToast('error', '操作失败', value.message);
              }
            });
        } else  {
          this.setToast('error', '操作错误', '请填写完整的房屋信息');
        }
      },
      reject: () => {
      }
    });

  }
  // sure modify tenant
  public  tenantModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.roomTitle.roomCode = this.roomTitle.roomCode.slice(this.roomTitle.roomCode.lastIndexOf('-') + 1, this.roomTitle.roomCode.length);
          this.tenantSrv.addRoomCodeInfo(this.roomTitle).subscribe(
            value => {
              console.log(value);
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.tenantModifayDialog = false;
                this.clearData();
                this.tenantInitialization();
              } else  {
                this.setToast('error', '操作失败', value.message);
              }
            }
          );
      },
      reject: () => {
      }
    });
  }
  // delete tenant
  public  tenantDeleteClick(): void {
    if (this.tenantSelect === undefined || this.tenantSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.tenantSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loadHidden = false;
          this.tenantSelect.forEach( v => {
            this.deleteId.push({roomCode: v.roomCode});
          });
          this.tenantSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
            value => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.tenantInitialization();
                this.clearData();
              }
              console.log(value);
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
  // select houseinfo
  public  tenantonRowSelect(e): void {
    this.roomTitle = e.data;
    console.log(this.roomTitle);
  }
  // add more info Dialog
  public  AddMoreClick(): void {
    this.tenantUploadFileDialog = true;
  }

  // upload file
  public  tenantUploadSureClick(): void {
    const fileData = new FormData();
    this.uploadedFiles.forEach(v => {
      fileData.append('file', v);
    });
    console.log(fileData.getAll('file'));
    this.confirmationService.confirm({
      message: `确认要上传吗？`,
      header: '上传提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tenantSrv.uploadTenantInfoFile(fileData).subscribe(
          (value) => {
            console.log(value);
            this.loadHidden = false;
            this.loadHidden = true;
            this.uploadedFiles = [];
            this.setToast('success', '上传成功', value.message);
            this.tenantInitialization();
          }
        );
      },
      reject: () => {
        console.log('这里是上传信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // toast
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
            console.log(value);
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
              this.setToast('error', '操作错误', '用户信息数据错误');
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
    console.log(event);
    this.nowPage = event;
    this.searchTenantData.pageNo = this.nowPage;
    if (this.searchTenantData.villageCode !== '' || this.searchTenantData.regionCode !== '' || this.searchTenantData.buildingCode !== '' || this.searchTenantData.unitCode !== '') {
      this.tenantSrv.queryTenantInfoList(this.searchTenantData).subscribe(
        (value) => {
          console.log(value);
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
          console.log(value);
          this.loadHidden = true;
          if (value.status === '1000') {
            if (value.data.contents) {
              this.tenantTableContent = value.data.contents;
            }
            this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
          } else {
            this.setToast('error', '操作错误', value.message);
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
}
