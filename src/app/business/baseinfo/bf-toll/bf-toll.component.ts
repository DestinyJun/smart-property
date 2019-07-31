import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfTollService} from '../../../common/services/bf-toll.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddToll, BfTollTitle, ModifyToll, ModifyTollDrop, Toll, TollMoreInfo} from '../../../common/model/bf-toll.model';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public tollTableTitle: any;
  public tollTableContent: Toll[];
  public tollTableTitleStyle: any;
  public tollSelect: Toll[] = [];
  public moreTollMoreTitle = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpaceNature', header: '车位性质'},
    {field: 'parkingSpaceType', header: '车位类型'},
    {field: 'operating', header: '操作'},
  ]; // 数据
  // 添加相关
  public tollAddDialog: boolean;
  public tollAdd: AddToll[] = [];
  public tollAddinfo: AddToll = new AddToll();
  public tollMoreInfo: TollMoreInfo[] = [];
  public tollTitle: BfTollTitle = new BfTollTitle();
  public tollAddoption = {
    parkingSpaceNature: [],
    parkingSpaceType: [],
    datedif: []
  };
  public enableOption: any[] = [];
  public refundOption: any[] = [];
  public optionTollType: any[] = [];
  // 修改相关
  public tollModifyDialog: boolean;
  public tollModify: any[] = [];
  public modifytoll: any[] = [];
  public tollModifyData: ModifyTollDrop = new ModifyTollDrop();
  public tollModifyDatas: ModifyTollDrop[] = [];
  public tollEnableMedify: any;
  public tollrefundMedify: any;
  public tollChargeTypeMedify: any;
  public ids: any[] = [];
  // 详情相关
  public tollDetailDialog: boolean;
  public tollDetail: ModifyToll = new ModifyToll();
  public TollMoreTitleDetail = [
    {field: 'id', header: '序号'},
    {field: 'areaMin', header: '面积最小值'},
    {field: 'areaMax', header: '面积最大值'},
    {field: 'datedif', header: '缴费月数'},
    {field: 'money', header: '金额'},
    {field: 'discount', header: '折扣'},
    {field: 'parkingSpaceNature', header: '车位性质'},
    {field: 'parkingSpaceType', header: '车位类型'},
  ];
  // // 列表添加相关
  // public tollDialog: boolean;
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public esDate: any; // 清除时钟
  public option: any; // 清除时钟
  public loadHidden = true;
  public nowPage = 1;
  public deleteId: any[] = [];
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tollSrv: BfTollService
  ) { }
  ngOnInit() {
    this.tollInitialization();
  }

  // initialization toll
  public  tollInitialization(): void {
    console.log('这里是信息的初始化');
    // this.moreTollMore = [
    // ];
    this.tollTableTitle = [
      {field: 'chargeCode', header: '项目编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'chargeType', header: '项目类型'},
      {field: 'chargeUnit', header: '收费单位'},
      {field: 'chargeStandard', header: '收费单价'},
      {field: 'enable', header: '是否启用'},
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
    this.tollSrv.queryBfTollPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        console.log(value);
        this.tollTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.tollTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.tollSelect);

  }
  // condition search click
  public  tollSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  toll
  public  tollAddClick(): void {
    this.tollAddoption = {
        parkingSpaceNature: [],
        parkingSpaceType: [],
        datedif: []
      };
    this.enableOption = [];
    this.refundOption = [];
    this.optionTollType = [];
    this.tollSrv.queryTollChargeStatus({settingType: 'REFUND'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.refundOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.optionTollType.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'ENABLED'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.enableOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'DATEDIF'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.tollAddoption.datedif.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollAllStatus({settingType: 'CWXZ'}).subscribe(
      value => {
        if (value.status === '1000') {
            value.data.forEach(v => {
            this.tollAddoption.parkingSpaceNature.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollAllStatus({settingType: 'CWLX'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.tollAddoption.parkingSpaceType.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollAddDialog = true;
  }
  // sure add toll
  public  tollAddSureClick(): void {
    console.log(this.tollAdd);
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if  (this.tollMoreInfo.length === 0) {
           this.tollSrv.queryTollAdd(this.tollTitle).subscribe(
             value => {
               if (value.status === '1000')  {
                 this.setToast('success', '操作成功', value.message);
                 this.tollInitialization();
                 this.tollAddDialog = false;
                 this.clearData();
               } else {
                 this.setToast('error', '操作错误', '添加失败,' + value.message);
               }
             }
           );
        } else {
          this.tollMoreInfo.forEach( v => {
            this.tollAddinfo.chargeType = this.tollTitle.chargeType;
            this.tollAddinfo.chargeName = this.tollTitle.chargeName;
            this.tollAddinfo.chargeStandard = this.tollTitle.chargeStandard;
            this.tollAddinfo.chargeUnit = this.tollTitle.chargeUnit;
            this.tollAddinfo.enable = this.tollTitle.enable;
            this.tollAddinfo.refund = this.tollTitle.refund;
            this.tollAddinfo.areaMax = v.areaMax;
            this.tollAddinfo.areaMin = v.areaMin;
            this.tollAddinfo.money = v.money;
            this.tollAddinfo.datedif = v.datedif;
            this.tollAddinfo.discount = v.discount;
            this.tollAddinfo.parkingSpaceNature = v.parkingSpaceNature;
            this.tollAddinfo.parkingSpaceType = v.parkingSpaceType;
            this.tollAdd.push(this.tollAddinfo);
            this.tollAddinfo = new AddToll();
            console.log(this.tollAddinfo.chargeCode);
          });
          this.tollSrv.addBfTollInfo({data: this.tollAdd}).subscribe(
            value =>  {
              console.log(value);
              if (value.status === '1000')  {
                this.setToast('success', '操作成功', value.message);
                this.tollInitialization();
                this.tollAddDialog = false;
                this.clearData();
              }
            }
          );
        }

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify toll
  public tollModifyClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0 ) {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tollSelect.length === 1) {

      this.tollAddoption = {parkingSpaceNature: [], parkingSpaceType: [], datedif: []};
      this.enableOption = [];
      this.refundOption = [];
      this.optionTollType = [];
      this.tollSrv.queryTollChargeStatus({settingType: 'REFUND'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.refundOption.push({label: v.settingName, value: v.settingCode});
              if (this.tollTitle.refund.toString() === v.settingCode) {
                this.tollrefundMedify = v.settingName;
              }
            });
          }
        }
      );
      this.tollSrv.queryTollChargeStatus({settingType: 'CHARGE_TYPE'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.optionTollType.push({label: v.settingName, value: v.settingCode});
              if (this.tollTitle.chargeType.toString() === v.settingCode) {
                this.tollChargeTypeMedify = v.settingName;
              }
            });
          }
        }
      );
      this.tollSrv.queryTollChargeStatus({settingType: 'ENABLED'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.enableOption.push({label: v.settingName, value: v.settingCode});
              if (this.tollTitle.enable.toString() === v.settingCode) {
                this.tollEnableMedify = v.settingName;
              }
            });
          }
        }
      );
      this.tollSrv.queryTollChargeStatus({settingType: 'DATEDIF'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.tollAddoption.datedif.push({label: v.settingName, value: v.settingCode});
            });
          }
        }
      );
      this.tollSrv.queryTollAllStatus({settingType: 'CWXZ'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.tollAddoption.parkingSpaceNature.push({label: v.settingName, value: v.settingCode});
            });
          }
        }
      );
      this.tollSrv.queryTollAllStatus({settingType: 'CWLX'}).subscribe(
        value => {
          if (value.status === '1000') {
            value.data.forEach(v => {
              this.tollAddoption.parkingSpaceType.push({label: v.settingName, value: v.settingCode});
            });
          }
        }
      );
      const Time = setInterval( () => {
        if (this.tollAddoption.datedif.length > 0 && this.tollAddoption.parkingSpaceType.length > 0 && this.tollAddoption.parkingSpaceNature.length > 0) {

            this.tollSrv.queryTollinfoDetail({chargeCode: this.tollSelect[0].chargeCode}).subscribe(
            value => {
              console.log(value);
              this.tollMoreInfo = [];
              this.tollModifyDatas = [];
              this.ids = [];
              clearInterval(Time);
              value.data.forEach( v => {
                this.tollMoreInfo.push({areaMin: v.areaMin, areaMax: v.areaMax, money: v.money, datedif: v.datedif, discount: v.discount, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceType: v.parkingSpaceType});
                this.ids.push({id: v.id});
                this.tollAddoption.datedif.forEach( val => {
                  if (v.datedif.toString() === val.value) {
                    this.tollModifyData.datedif = val.label;
                  }
                });
                this.tollAddoption.parkingSpaceType.forEach( val => {
                  if (v.parkingSpaceType.toString() === val.value) {
                    this.tollModifyData.parkingSpaceType = val.label;
                  }
                });
                this.tollAddoption.parkingSpaceNature.forEach( val => {
                  if (v.parkingSpaceNature.toString() === val.value) {
                    this.tollModifyData.parkingSpaceNature = val.label;
                  }
                });
                this.tollModifyDatas.push(this.tollModifyData);
                this.tollModifyData = new ModifyTollDrop();
              });
            }
          );
          }
      }, 100);
      this.tollModifyDialog = true;
    } else {
      this.setToast('error', '操作错误', '请选择需要修改的项');
    }
  }
  // sure modify toll
  public  tollModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.tollMoreInfo.length === 0) {
          console.log(this.tollTitle);
          this.tollSrv.updateTollInfo(this.tollTitle).subscribe(
            value => {
              console.log(value);
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.tollInitialization();
                this.tollModifyDialog = false;
                this.clearData();
              } else {
                this.setToast('error', '操作错误', '修改失败,' + value.message);
              }
            }
          );
        } else {
          this.tollMoreInfo.forEach( (v, index) => {
            this.tollAddinfo.chargeType = this.tollTitle.chargeType;
            this.tollAddinfo.chargeName = this.tollTitle.chargeName;
            this.tollAddinfo.chargeCode = this.tollTitle.chargeCode;
            this.tollAddinfo.chargeStandard = this.tollTitle.chargeStandard;
            this.tollAddinfo.chargeUnit = this.tollTitle.chargeUnit;
            this.tollAddinfo.enable = this.tollTitle.enable;
            this.tollAddinfo.refund = this.tollTitle.refund;
            this.tollAddinfo.areaMax = v.areaMax;
            this.tollAddinfo.areaMin = v.areaMin;
            this.tollAddinfo.money = v.money;
            this.tollAddinfo.datedif = v.datedif;
            this.tollAddinfo.discount = v.discount;
            if (index + 1 <= this.ids.length) {
              this.tollAddinfo.id = this.ids[index].id;
            } else {
              this.tollAddinfo.id = null;
            }
            this.tollAddinfo.parkingSpaceNature = v.parkingSpaceNature;
            this.tollAddinfo.parkingSpaceType = v.parkingSpaceType;
            this.modifytoll.push(this.tollAddinfo);
            this.tollAddinfo = new AddToll();
          });
          this.tollSrv.updateTollListinfo({data: this.modifytoll}).subscribe(
            value => {
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.tollInitialization();
                this.tollModifyDialog = false;
                this.clearData();
              } else {
                this.setToast('error', '操作错误', '修改失败,' + value.message);
              }
            }
          );
        }

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete toll
  public  tollDeleteClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0) {
      this.setToast('error',  '操作错误', '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.tollSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.tollSelect.forEach( v => {
            this.deleteId.push({chargeCode: v.chargeCode});
          });
          this.tollSrv.deleteTollinfo({data: this.deleteId}).subscribe(
            value => {
              if (value.status === '1000') {
                this.setToast('success',  '操作成功', '添加成功' + value.message);
                this.clearData();
                this.tollInitialization();
              } else {
                this.setToast('error', '操作错误', '删除失败,' + value.message);
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
  // select toll
  public  tollonRowSelect(e): void {
    this.tollModify = e.data;
    this.tollTitle = e.data;
    console.log(this.tollTitle);
  }
  // seeDetail Dialog
  public  toolDetailClick(e): void {

    this.tollTitle = e;
    this.tollAddoption = {parkingSpaceNature: [], parkingSpaceType: [], datedif: []};
    this.enableOption = [];
    this.refundOption = [];
    this.optionTollType = [];
    this.tollSrv.queryTollChargeStatus({settingType: 'REFUND'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.refundOption.push({label: v.settingName, value: v.settingCode});
            if (this.tollTitle.refund.toString() === v.settingCode) {
              this.tollrefundMedify = v.settingName;
            }
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'CHARGE_TYPE'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.optionTollType.push({label: v.settingName, value: v.settingCode});
            if (this.tollTitle.chargeType.toString() === v.settingCode) {
              this.tollChargeTypeMedify = v.settingName;
            }
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'ENABLED'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.enableOption.push({label: v.settingName, value: v.settingCode});
            if (this.tollTitle.enable.toString() === v.settingCode) {
              this.tollEnableMedify = v.settingName;
            }
          });
        }
      }
    );
    this.tollSrv.queryTollChargeStatus({settingType: 'DATEDIF'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.tollAddoption.datedif.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollAllStatus({settingType: 'CWXZ'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.tollAddoption.parkingSpaceNature.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.tollSrv.queryTollAllStatus({settingType: 'CWLX'}).subscribe(
      value => {
        if (value.status === '1000') {
          value.data.forEach(v => {
            this.tollAddoption.parkingSpaceType.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    const detailData = setInterval(() => {
      if (this.tollAddoption.datedif.length > 0 && this.tollAddoption.parkingSpaceNature.length > 0 && this.tollAddoption.parkingSpaceType.length> 0){
        this.tollSrv.queryTollinfoDetail({chargeCode: e.chargeCode}).subscribe(
          value => {
            this.tollMoreInfo = [];
            this.tollModifyDatas = [];
            clearInterval(detailData);
            value.data.forEach( v => {
              this.tollMoreInfo.push({areaMin: v.areaMin, areaMax: v.areaMax, money: v.money, datedif: v.datedif, discount: v.discount, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceType: v.parkingSpaceType});
              this.tollAddoption.datedif.forEach( val => {
                if (v.datedif.toString() === val.value) {
                  this.tollModifyData.datedif = val.label;
                }
              });
              this.tollAddoption.parkingSpaceType.forEach( val => {
                if (v.parkingSpaceType.toString() === val.value) {
                  this.tollModifyData.parkingSpaceType = val.label;
                }
              });
              this.tollAddoption.parkingSpaceNature.forEach( val => {
                if (v.parkingSpaceNature.toString() === val.value) {
                  this.tollModifyData.parkingSpaceNature = val.label;
                }
              });
              this.tollModifyDatas.push(this.tollModifyData);
              this.tollModifyData = new ModifyTollDrop();
            });
            console.log(this.tollAddoption);
          }
        );
      }
    }, 500);
    this.tollDetailDialog = true;
    // console.log(e);
    // console.log();
  }
  public  clearData(): void {
      this.tollAdd = [];
      this.tollMoreInfo = [];
      this.tollAddinfo = new AddToll();
      this.tollTitle = new BfTollTitle();
      this.tollSelect = [];
      this.tollModifyData = new ModifyTollDrop();
      this.tollModifyDatas = [];
      this.modifytoll = [];
      this.ids = [];
  }
  // 添加一条数据
  public  addMoreTollClick(): void {
      this.tollMoreInfo.push({areaMin: '', areaMax: '', money: '', datedif: '', discount: '10', parkingSpaceNature: '', parkingSpaceType: ''});
      this.tollModifyData.datedif = '请选择月数';
      this.tollModifyData.parkingSpaceNature = '请选择车位性质';
      this.tollModifyData.parkingSpaceType = '请选择车位类型';
      this.tollModifyDatas.push(this.tollModifyData);
  }
  // delete moreTollMore
  public deleteTollMoreClick(index, e): void {
    console.log(e);
    console.log(this.ids.length);
    console.log(index);
    if (index + 1 > this.ids.length) {
      this.tollMoreInfo.splice(index, 1);
    } else {
      console.log(this.ids[index].id);
      this.tollSrv.deleteTollList({id: this.ids[index].id}).subscribe(
        value => {
          console.log(value);
          if (value.status === '1000') {
            // console.log();
            this.tollMoreInfo.splice(index, 1);
          } else {
            this.setToast('error', '删除失败', value.message);
          }
        }
      );
    }
  }

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
  public nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.tollSrv.queryBfTollPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
      value => {
        this.loadHidden = true;
        this.tollTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
  }
  public  changeData(e): void {
      console.log(e);
  }
}
