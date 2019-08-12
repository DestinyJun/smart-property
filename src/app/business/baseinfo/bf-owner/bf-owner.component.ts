import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BfOwnerService} from '../../../common/services/bf-owner.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddOwner, ModifyOwner, OwerList, Owner, RoomTitle, SearchOwner} from '../../../common/model/bf-owner.model';
import {C} from '@angular/cdk/typings/esm5/keycodes';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-bf-owner',
  templateUrl: './bf-owner.component.html',
  styleUrls: ['./bf-owner.component.less']
})
export class BfOwnerComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  // @ViewChild('file') file: Input;
  public ownerTableTitle: any;
  public ownerTableContent: Owner[];
  public ownerTableTitleStyle: any;
  public ownerSelect: any;
  // 查询相关
  public searchOwerData: SearchOwner = new SearchOwner();
  public SearchOption = {village: [], region: [], building: [], unit: []};
  // 添加相关
  public ownerAddDialog: boolean;
  public ownerAdd: AddOwner = new AddOwner();
  // public ownerAdd: AddOwner = new AddOwner();
  public roomTitle: RoomTitle = new RoomTitle();
  public ownerList: OwerList[] = [];
  public timeHide = true;
  public ownerTimeDetailHide = true;

  public roomTypeOption: any[] = [];
  public roomStatusOption: any[] = [];
  public renovationStatusOption: any[] = [];
  public sexOption: any[] = [];
  public owerMoreTitleDetail = [
    {field: 'surname', header: '客户姓氏'},
    {field: 'sex', header: '性别'},
    {field: 'mobilePhone', header: '客户电话'},
    {field: 'identity', header: '身份'},
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
  public ownerinfo: OwerList = new OwerList();
  public ownerDialog: boolean;
  public ownerUserSelect: any;
  public normalChargeOption: any[] = [];
  public identityOption: any[] = [];
  // 修改相关
  public ownerModifayDialog: boolean;
  public ownerModify: ModifyOwner[]  = [];
  public ownerDetailDialog: boolean;
  public ownerDetail: Owner = new Owner();
  public roomTypeName: any;
  public roomStatusName: any;
  public renovationStatusName: any;
  public sexName: any;
  // 业主修改相关
  public ownerModifyDialog: any;
  public ownerListIndex: any;
  // 上传相关
  public ownerUploadFileDialog: boolean;
  public uploadedFiles: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  public nowPage = 1;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private owerSrv: BfOwnerService,
    private globalSrv: GlobalService,
    private toolSrv: PublicMethedService,
    private datePipe: DatePipe,

  ) { }
  ngOnInit() {
    this.ownerInitialization();
  }

  // initialization houseinfo
  public  ownerInitialization(): void {
    this.loadHidden = false;
    // console.log('这里是信息的初始化');
    this.searchOwerData.pageNo = this.nowPage;
    this.searchOwerData.pageSize = 10;
    this.searchOwerData.villageCode = '';
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';

    this.owerSrv.queryOwerDataList(this.searchOwerData).subscribe(
       (value) => {
         console.log(value);
         this.loadHidden = true;
         this.ownerTableContent = value.data.contents;
         this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
       }
     );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
        });
      }
    );
    this.esDate = this.toolSrv.esDate;

    this.ownerTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'roomSize', header: '房间大小'},
      // {field: 'roomStatus', header: '房间使用状态'},
      {field: 'operating', header: '操作'}
    ];

    this.ownerTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.roomTitle);
  }
  // village change function
  public  VillageChange(e): void {
    // console.log(this.test);
    this.loadHidden = false;
    this.searchOwerData.villageCode = '';
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.searchOwerData.villageCode = e.value;

    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
        (value) => {
          console.log(value);
          this.loadHidden = true;
          value.data.forEach( v => {
            this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
          });
        }
      );
  }
  // region change function
  public  regionChange(e): void {
    this.loadHidden = false;
    this.searchOwerData.regionCode = '';
    this.searchOwerData.buildingCode = '';
    this.searchOwerData.unitCode = '';
    this.searchOwerData.regionCode = e.value;
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
  // building change function
  public  buildingChange(e): void {
    this.searchOwerData.unitCode = '';
    this.SearchOption.unit = [];
    this.searchOwerData.buildingCode = e.value;
    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
        });
      }
    );
  }
  // unit change function
  public  unitChange(e): void {
    this.searchOwerData.unitCode = '';
    this.searchOwerData.unitCode = e.value;
  }
  // condition search click
  public  ownerSearchClick(): void {
    // @ts-ignore
    if ( (this.input.nativeElement.value !== undefined && this.input.nativeElement.value !== '') || this.searchOwerData.villageCode !== '' ) {
      this.loadHidden = false;
      this.searchOwerData.pageNo = 1;
      this.owerSrv.queryowerInfoList(this.searchOwerData).subscribe(
        (value) => {
          this.loadHidden = true;
          this.ownerTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      );
    } else {
      this.setToast('error', '操作错误', '请选择或输入搜索条件');
    }
  }
  // renovation change function
  public  renovationChange(e): void {
      // console.log(e);
      if (e.value === '1') {
        this.timeHide = false;
      //   this.roomTitle.renovationStartTime = '';
      //   this.roomTitle.renovationDeadline = '';
      } else {
        this.timeHide = true;
      //   this.roomTitle.renovationStartTime = '';
      //   this.roomTitle.renovationDeadline = '';
      }
  }
  // show add owner box
  public  ownerAddClick(): void {
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
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roomTypeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.roomStatusOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.renovationStatusOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.ownerAddDialog = true;
  }
  // sure add houser and owner info
  public  ownerAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.roomTitle);
        if (this.ownerList.length === 0 ) {
          if (this.roomTitle.renovationStartTime !== '') {
            this.roomTitle.renovationStartTime = this.datePipe.transform(this.roomTitle.renovationStartTime, 'yyyy-MM-dd');
          }
          if (this.roomTitle.renovationDeadline !== '') {
            this.roomTitle.renovationDeadline = this.datePipe.transform(this.roomTitle.renovationDeadline, 'yyyy-MM-dd');
          }
          this.owerSrv.addRoomCodeInfo(this.roomTitle).subscribe(
            value => {
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.ownerAddDialog = false;
                this.clearData();
                this.ownerInitialization();
              } else  {
                this.setToast('error', '操作失败', value.message);
              }
            }
          );
        } else {
          this.ownerAddDialog = false;
          this.clearData();
          this.ownerInitialization();
          this.setToast('success', '操作成功', '操作成功');
        }
      },
      reject: () => {
      }
    });

  }
  // delete OwerInfo
  public  deleteOwerMoreClick(e): void {
    this.owerSrv.deleteOwerInfo({roomCode: e.roomCode, userId: e.userId}).subscribe(
        value => {
          if (value.status === '1000') {
            this.setToast('success', '请求成功', value.message);
            this.selectOwerInfo(e.roomCode);
          } else {
            this.setToast('error', '请求失败', value.message);
          }
        }
      );
  }
  public  addMoreOwerClick(): void {
    this.ownerinfo = new OwerList();
    this.sexOption = [];
    this.normalChargeOption = [];
    this.identityOption = [];
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'SEX'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.sexOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'IDENTITY'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (v.settingName !== '租客')
          this.identityOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.ownerDialog = true;
  }
  // submit owner and roomInfo
  public  owerInfoAddClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let flagBole = true;
        this.loadHidden = false;
        if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
           this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
         }
        if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
          this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
        }
        for (const key in this.roomTitle) {
          this.ownerAdd[key] = this.roomTitle[key];
        }
        for (const key in this.ownerinfo) {
          this.ownerAdd[key] = this.ownerinfo[key];
        }
        for (const key in this.ownerinfo) {
           if (this.ownerinfo[key] === '') {
             flagBole = false;
           }
        }
        this.ownerAdd.startBillingTime = this.datePipe.transform(this.ownerAdd.startBillingTime, 'yyyy-MM-dd');
        this.ownerAdd.roomCode = this.ownerAdd.roomCode.slice(this.ownerAdd.roomCode.lastIndexOf('-') + 1, this.ownerAdd.roomCode.length);
        delete this.ownerAdd.buildingCode;
        delete this.ownerAdd.unitCode;
        delete this.ownerAdd.regionCode;
        delete this.ownerAdd.villageCode;
        if (flagBole) {
          this.owerSrv.addSingleOwerInfo(this.ownerAdd).subscribe(
            value => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', '添加成功');
                this.selectOwerInfo(value.data);
                // this.clearData();
                this.ownerDialog = false;
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
    // this.ownerDialog = false;
    // this.ownerinfo.startBillingTime = this.datePipe.transform(this.ownerinfo.)
    // this.ownerList.push(this.ownerinfo);
  }
  // detail ownerInfo
  public  ownerDetailClick(e): void {
    this.identityOption = [];
    this.sexOption = [];
    this.normalChargeOption = [];
    this.roomTitle = e;
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomType.toString() === v.settingCode) {
            this.roomTypeName = v.settingName;
          }
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.roomStatus.toString() === v.settingCode) {
            this.roomStatusName = v.settingName;
          }
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (this.roomTitle.renovationStatus === v.settingCode) {
            this.renovationStatusName = v.settingName;
            if (this.renovationStatusName === '未装修') {
              this.ownerTimeDetailHide = true;
            } else {
              this.ownerTimeDetailHide = false;
            }
          }
        });
      }
    );
    this.selectOwerInfo(this.roomTitle.roomCode);
    // if (this.renovationStatusName === '未装修') {
    //
    // }
    this.ownerDetailDialog = true;
  }
  // modify owner
  public ownerModifyClick(): void {
    console.log(this.ownerSelect);
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0 ) {
     this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.ownerSelect.length === 1) {
      for (const roomTitleKey in this.roomTitle) {
        if (this.roomTitle[roomTitleKey] === null ) {
          this.roomTitle[roomTitleKey] = '';
        }
      }
      this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_TYPE'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomTypeOption.push({label: v.settingName, value: v.settingCode});
            if (this.roomTitle.roomType.toString() === v.settingCode) {
              this.roomTypeName = v.settingName;
            }
          });
        }
      );
      this.owerSrv.queryOwerInfoAllStatus({settingType: 'ROOM_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.roomStatusOption.push({label: v.settingName, value: v.settingCode});

            if (this.roomTitle.roomStatus.toString() === v.settingCode) {
              this.roomStatusName = v.settingName;
            }
          });
        }
      );
      this.owerSrv.queryOwerInfoAllStatus({settingType: 'RENOVATION_STATUS'}).subscribe(
        value => {
          value.data.forEach( v => {
            this.renovationStatusOption.push({label: v.settingName, value: v.settingCode});

            if (this.roomTitle.renovationStatus.toString() === v.settingCode) {
              this.renovationStatusName = v.settingName;
              if ( this.renovationStatusName !== '未装修' ) {
                console.log(this.renovationStatusName);
                this.timeHide = false;
              }
            }
          });
        }
      );

      this.selectOwerInfo(this.roomTitle.roomCode);
      this.ownerModifayDialog = true;
      console.log(this.roomTitle);
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
    if (this.ownerUserSelect === undefined || this.ownerUserSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.ownerUserSelect.length === 1) {
      console.log(this.sexOption);
      console.log(this.normalChargeOption);
      this.ownerinfo =   this.ownerUserSelect[0];

      this.ownerListIndex = this.ownerList.indexOf(this.ownerinfo);
      this.ownerModifyDialog = true;
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
        this.loadHidden = false;
        if (this.roomTitle.hasOwnProperty('renovationDeadline') && this.roomTitle.renovationDeadline !== '' ) {
          this.roomTitle.renovationDeadline = this.datePipe.transform( this.roomTitle.renovationDeadline , 'yyyy-MM-dd');
        }
        if (this.roomTitle.hasOwnProperty('renovationStartTime') && this.roomTitle.renovationStartTime !== '') {
          this.roomTitle.renovationStartTime = this.datePipe.transform( this.roomTitle.renovationStartTime , 'yyyy-MM-dd');
        }
        for (const key in this.roomTitle) {
          this.ownerAdd[key] = this.roomTitle[key];
        }
        for (const ownerinfoKey in this.ownerinfo) {
          if (this.ownerinfo[ownerinfoKey] === '') {
            flagBole = false;
          }
        }
        if (this.ownerinfo.sex !== null ) {
          this.sexOption.forEach(val => {
            if (this.ownerinfo.sex === val.label) {
              this.ownerinfo.sex = val.value;
            }
          });
        }
        if (this.ownerinfo.normalPaymentStatus !== null)  {
          this.normalChargeOption.forEach(val => {
            if (this.ownerinfo.normalPaymentStatus === val.label) {
              this.ownerinfo.normalPaymentStatus = val.value;
            }
          });
        }
        if (this.ownerinfo.identity !== null) {
          this.identityOption.forEach(val => {
            if (this.ownerinfo.identity === val.label) {
              this.ownerinfo.identity = val.value;
            }
          });
        }
        for (const key in this.ownerinfo) {
          this.ownerAdd[key] = this.ownerinfo[key];
        }
        this.ownerAdd.startBillingTime = this.datePipe.transform(this.ownerAdd.startBillingTime, 'yyyy-MM-dd');
        this.ownerAdd.roomCode = this.ownerAdd.roomCode.slice(this.ownerAdd.roomCode.lastIndexOf('-') + 1, this.ownerAdd.roomCode.length);
        if (flagBole) {
          this.owerSrv.addSingleOwerInfo(this.ownerAdd).subscribe(
            value => {
              console.log(value);
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', '添加成功');
                this.selectOwerInfo(value.data);
                // this.clearData();
                this.ownerModifyDialog = false;
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
  // sure modify owner
  public  ownerModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.ownerList.length === 0 ) {
          console.log(this.roomTitle);
          this.owerSrv.addRoomCodeInfo(this.roomTitle).subscribe(
            value => {
              console.log(value);
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.ownerModifayDialog = false;
                this.clearData();
                this.ownerInitialization();
              } else  {
                this.setToast('error', '操作失败', value.message);
              }
            }
          );
        } else {
          this.ownerModifayDialog = false;
          this.clearData();
          this.ownerInitialization();
          this.setToast('success', '操作成功', '操作成功');
        }
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete owner
  public  ownerDeleteClick(): void {
    if (this.ownerSelect === undefined || this.ownerSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.ownerSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loadHidden = false;
          this.ownerSelect.forEach( v => {
             this.deleteId.push({roomCode: v.roomCode});
          });
          console.log({data: this.deleteId});
          this.owerSrv.deleteRoomInfo({data: this.deleteId}).subscribe(
            value => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.ownerInitialization();
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
  public  owneronRowSelect(e): void {
    this.roomTitle = e.data;
    console.log(this.roomTitle);
  }
  // add more upload file Dialog
  public  addMoreClick(): void {
    this.ownerUploadFileDialog = true;
  }

  // upload file
  public  ownerUploadSureClick(): void {
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
        this.owerSrv.uploadOwerInfoFile(fileData).subscribe(
          (value) => {
            console.log(value);
            this.loadHidden = false;
            this.loadHidden = true;
            this.uploadedFiles = [];
            this.setToast('success', '上传成功', value.message);
            this.ownerInitialization();
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
  public  clearData(): void {
     this.ownerAdd = new AddOwner();
     this.ownerModify = [];
     // this.SearchOption = {village: [], region: [], building: [], unit: []};
     this.roomTypeOption = [];
     this.roomStatusOption = [];
     this.renovationStatusOption = [];
     this.sexOption = [];
     this.roomTypeName = null;
     this.roomStatusName = null;
     this.renovationStatusName = null;
     this.sexName = null;
     this.ownerSelect = [];
     this.roomTitle = new RoomTitle();
     this.ownerList = [];
     this.ownerinfo = new OwerList();
     this.ownerUserSelect = [];
     this.identityOption = [];
     this.normalChargeOption = [];
 }
  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    console.log(event);
    this.nowPage = event;
    this.searchOwerData.pageNo = this.nowPage;
    if (this.searchOwerData.villageCode !== '' || this.searchOwerData.regionCode !== '' || this.searchOwerData.buildingCode !== '' || this.searchOwerData.unitCode !== '') {
      this.owerSrv.queryowerInfoList(this.searchOwerData).subscribe(
        (value) => {
          console.log(value);
          this.loadHidden = true;

          if (value.data.contents) {
            this.ownerTableContent = value.data.contents;
          }
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        }
      );
    } else {
      this.owerSrv.queryOwerDataList(this.searchOwerData).subscribe(
        (value) => {
          console.log(value);
          this.loadHidden = true;
          if (value.status === '1000') {
            if (value.data.contents) {
              this.ownerTableContent = value.data.contents;
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
  public  selectOwerInfo(code): void {
    this.sexOption = [];
    this.normalChargeOption = [];
    this.identityOption = [];
    this.ownerUserSelect = [];
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'SEX'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.sexOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'NORMAL_PAYMENT_STATUS'}).subscribe(
      value => {
        value.data.forEach( v => {
          this.normalChargeOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    this.owerSrv.queryOwerInfoAllStatus({settingType: 'IDENTITY'}).subscribe(
      value => {
        value.data.forEach( v => {
          if (v.settingName !== '租客')
            this.identityOption.push({label: v.settingName, value: v.settingCode});
        });
      }
    );
    const setTime = setInterval(() => {
      if (this.sexOption.length > 0 && this.normalChargeOption.length && this.normalChargeOption.length > 0){
        this.owerSrv.queryOwerInfoDetail({roomCode: code}).subscribe(
          value => {
            console.log(value);
            this.ownerList = [];
            if (value.status === '1000') {
              value.data.forEach( v => {
                for (const key in  v) {
                  this.ownerinfo[key] = v[key];
                }
                if (this.ownerinfo.sex != null ) {
                  this.sexOption.forEach(val => {
                    if (this.ownerinfo.sex.toString() === val.value.toString()) {
                      this.ownerinfo.sex = val.label;
                    }
                  });
                }
                if (this.ownerinfo.normalPaymentStatus != null)  {
                  this.normalChargeOption.forEach(val => {
                    if (this.ownerinfo.normalPaymentStatus.toString() === val.value.toString()) {
                      this.ownerinfo.normalPaymentStatus = val.label;
                    }
                  });
                }
                if (this.ownerinfo.identity != null){
                  this.identityOption.forEach(val => {
                    if (this.ownerinfo.identity.toString() === val.value.toString()) {
                      this.ownerinfo.identity = val.label;
                    }
                  });
                }
                this.ownerList.push(this.ownerinfo);
                this.ownerinfo = new OwerList();
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
}
