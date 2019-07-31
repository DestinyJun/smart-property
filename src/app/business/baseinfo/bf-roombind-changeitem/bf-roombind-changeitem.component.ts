import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {AddRoomBindChargeItem, ModifyRoomBindChargeItem} from '../../../common/model/bf-roomBindChargeItem.model';
import {BfRoomBindChargeitemService} from '../../../common/services/bf-room-bind-chargeitem.service';

@Component({
  selector: 'rbi-bf-roombind-changeitem',
  templateUrl: './bf-roombind-changeitem.component.html',
  styleUrls: ['./bf-roombind-changeitem.component.less']
})
export class BfRoombindChangeitemComponent implements OnInit {


  @ViewChild('input', {static: true}) input: Input;
  // @ViewChild('file') file: Input;
  public roombindTableTitle: any;
  public roombindTableContent: any[];
  public roombindTableTitleStyle: any;
  public roombindSelect: any;
  public nowPage = 1;
  // 查询相关
  public SearchOption = {village: [], region: [], building: [], unit: [], room: []};
  // 添加相关
  public roombindAddDialog: boolean;
  public roombindAdd: AddRoomBindChargeItem = new AddRoomBindChargeItem();
  public chargeItemOption: any[] = [];
  // 修改相关
  public roombindModifayDialog: boolean;
  public roombindModify: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public roombindDetailDialog: boolean;
  public roombindDetail: ModifyRoomBindChargeItem = new ModifyRoomBindChargeItem();
  public chargeItemName: any;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public esDate: any;
  public loadHidden = true;
  public deleteId: any[] = [];
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private roomBindChargeSrv: BfRoomBindChargeitemService,
    private globalSrv: GlobalService,
    private datePipe: DatePipe,

  ) { }
  ngOnInit() {
    this.roombindInitialization();
  }

  // initialization houseinfo
  public  roombindInitialization(): void {
    this.loadHidden = false;
    this.roomBindChargeSrv.queryRoomChangeInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        console.log(value.data.contents);
        this.loadHidden = true;

        if (value.status === '1000') {
          this.roombindTableContent = value.data.contents;
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.setToast('error', '请求错误', value.message);
        }
      }
    );
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
        // this.villageplaceholder =  this.SearchOption.village[0].label;
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
    this.roombindTableTitle = [
      {field: 'villageName', header: '小区名称'},
      {field: 'regionName', header: '地块名称'},
      {field: 'buildingName', header: '楼栋名称'},
      {field: 'unitName', header: '单元名称'},
      {field: 'roomCode', header: '房间编号'},
      {field: 'operating', header: '操作'}
    ];

    this.roombindTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  public  VillageChange(e): void {
    // console.log(this.test);
    console.log(e);
    this.loadHidden = false;
    this.roombindAdd.roomCode = null;
    this.SearchOption.region = [];
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.roombindAdd.villageName = e.originalEvent.target.innerText;
    this.roombindModify.villageName = e.originalEvent.target.innerText;

    this.globalSrv.queryRegionInfo({villageCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this.loadHidden = true;
              this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
            });
          } else {
            this.setToast('warn', '请求成功', '数据为空');
          }
        }  else {
          this.setToast('error', '请求失败', value.message);
        }
      }
    );
  }
  public  regionChange(e): void {
    this.SearchOption.building = [];
    this.SearchOption.unit = [];
    this.roombindAdd.roomCode = null;
    this.roombindAdd.regionName = e.originalEvent.target.innerText;
    this.roombindModify.regionName = e.originalEvent.target.innerText;
    console.log(e.value);
    this.globalSrv.queryBuilingInfo({regionCode: e.value}).subscribe(
      (value) => {
        console.log(value);
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
            });
          } else {
            this.setToast('warn', '请求成功', '数据为空');
          }
        }  else {
          this.setToast('error', '请求失败', value.message);
        }

      }
    );
  }
  public  buildingChange(e): void {
    this.roombindAdd.roomCode = null;
    this.roombindAdd.buildingName = e.originalEvent.target.innerText;
    this.roombindModify.buildingName = e.originalEvent.target.innerText;

    this.globalSrv.queryunitInfo({buildingCode: e.value}).subscribe(
      (value) => {
        if (value.status === '1000') {
          if (value.data.length !== 0) {
            value.data.forEach( v => {
              this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
            });
          } else {
            this.setToast('warn', '请求成功', '数据为空');
          }
        } else {
          this.setToast('error', '请求失败', value.message);
        }
        console.log(value);

      }
    );
  }
  public  unitChange(e): void {
    this.roombindAdd.unitName = e.originalEvent.target.innerText;
    this.roombindModify.unitName = e.originalEvent.target.innerText;
    this.globalSrv.queryRoomCode({unitCode: e.value}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
        });
      }
    );
  }
  // condition search click
  public  roombindSearchClick(): void {
  }
  // add roombind
  public  roombindAddClick(): void {
    this.SearchOption.village = [];
    this.globalSrv.queryVillageInfo({}).subscribe(
      (data) => {
        console.log(data);
        data.data.forEach( v => {
          this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
          // = v.villageName;
        });
      }
    );
    this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
        });
      }
    );
    this.roombindAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add houseinfo
  public  roombindAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadHidden = false;
        this.roomBindChargeSrv.addRoomChangeInfo(this.roombindAdd).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.setToast('success', '操作成功', '添加成功');
              this.clearData();
              this.roombindAddDialog = false;
              this.roombindInitialization();
            } else {
              this.setToast('error', '操作失败', value.message);
            }
          });
      },
      reject: () => {
      }
    });
  }
  // detail roombindInfo
  public  roombindDetailClick(e): void {
    this.roombindDetail = e;
    this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
      value => {
        console.log(value);
        value.data.forEach( v => {
          this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
          if (this.roombindDetail.chargeCode === v.chargeCode) {
            this.chargeItemName = v.chargeName;
          }
        });
      }
    );
    this.roombindDetailDialog = true;
  }
  // modify roombind
  public roombindModifyClick(): void {
    console.log(this.roombindSelect);
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.roombindSelect.length === 1) {
      this.SearchOption.village = [];
      this.globalSrv.queryVillageInfo({}).subscribe(
        (data) => {
          console.log(data);
          data.data.forEach( v => {
            this.SearchOption.village.push({label: v.villageName, value: v.villageCode});
            // = v.villageName;
          });
        }
      );
      this.roomBindChargeSrv.queryRoomChangeInfoById({}).subscribe(
        value => {
          value.data.forEach( v => {
            this.chargeItemOption.push({label: v.chargeName, value: v.chargeCode});
            if (this.roombindModify.chargeCode === v.chargeCode) {
              this.chargeItemName = v.chargeName;
            }
          });
        }
      );
      this.globalSrv.queryRegionInfo({villageCode: this.roombindModify.villageCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this.loadHidden = true;
            this. SearchOption.region.push({label: v.regionName, value: v.regionCode});
          });
        }
      );
      this.globalSrv.queryBuilingInfo({regionCode: this.roombindModify.regionCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this. SearchOption.building.push({label: v.buildingName, value: v.buildingCode});
          });
          this.loadHidden = true;

        }
      );
      this.globalSrv.queryunitInfo({buildingCode: this.roombindModify.buildingCode}).subscribe(
        (value) => {
          value.data.forEach( v => {
            this. SearchOption.unit.push({label: v.unitName, value: v.unitCode});
          });
        }
      );
      this.globalSrv.queryRoomCode({unitCode: this.roombindModify.unitCode}).subscribe(
        value => {
          value.data.forEach( v => {
            this.SearchOption.room.push({label: v.roomCode, value: v.roomCode});
          });
        }
      );
      this.roombindModifayDialog = true;
    } else {
      this.setToast('success', '操作成功', '只能选择一项进行修改');
    }
  }
  // sure modify roombind
  public  roombindModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.loadHidden = false;
        console.log(this.roombindModify);
        this.roomBindChargeSrv.updateRoomChangeInfo(this.roombindModify).subscribe(
          value => {
            this.loadHidden = true;
            if (value.status === '1000') {
              this.roombindModifayDialog = false;
              this.setToast('success', '操作成功', value.message);
              this.roombindInitialization();
              this.clearData();
            } else {
              this.setToast('error', '操作失败', value.message);
            }
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
  // delete roombind
  public  roombindDeleteClick(): void {
    if (this.roombindSelect === undefined || this.roombindSelect.length === 0) {
      this.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.roombindSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loadHidden = false;
          this.roombindSelect.forEach( v => {
            this.deleteId.push(v.id);
          });
          this.roomBindChargeSrv.deleteRoomChangeInfo({ids: this.deleteId.join(',')}).subscribe(
            value => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.roombindInitialization();
                this.clearData();
              } else {
                this.setToast('error', '操作失败', value.message);
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
  // select houseinfo
  public  roombindonRowSelect(e): void {
    this.roombindModify = e.data;
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
    this.roombindAdd = new AddRoomBindChargeItem();
    this.roombindModify = new ModifyRoomBindChargeItem();
    this.roombindDetail = new ModifyRoomBindChargeItem();
    this.SearchOption.building = [];
    this.SearchOption.region = [];
    this.SearchOption.room = [];
    this.SearchOption.unit = [];
    this.chargeItemOption = [];
    this.roombindSelect = [];
  }
  // 分页请求
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.roomBindChargeSrv.queryRoomChangeInfoPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
        (value) => {
         if (value.status === '1000') {
           this.loadHidden = true;
           if (value.data.contents) {
             this.roombindTableContent = value.data.contents;
           }
           this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
         } else {
           this.setToast('error', '请求失败', value.message);
         }
        }
      );
    }
}
