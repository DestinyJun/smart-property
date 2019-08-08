import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfTollService} from '../../../common/services/bf-toll.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddToll, BfTollTitle, ModifyToll, ModifyTollDrop, Toll, TollMoreInfo} from '../../../common/model/bf-toll.model';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {defer} from 'rxjs';

@Component({
  selector: 'rbi-bf-toll',
  templateUrl: './bf-toll.component.html',
  styleUrls: ['./bf-toll.component.less']
})
export class BfTollComponent implements OnInit {

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
  // 其他相关
  public esDate: any; // 清除时钟
  public option: any; // 清除时钟
  public loadHidden = true;
  public nowPage = 1;
  public deleteId: any[] = [];
  constructor(
    private toolSrv: PublicMethedService,
    private tollSrv: BfTollService
  ) { }
  ngOnInit() {
    this.tollInitialization();
  }

  // initialization toll
  public  tollInitialization(): void {
    this.tollTableTitle = [
      {field: 'chargeCode', header: '项目编号'},
      {field: 'chargeName', header: '项目名称'},
      {field: 'chargeType', header: '项目类型'},
      {field: 'chargeStandard', header: '收费单价'},
      {field: 'chargeUnit', header: '收费单位'},
      {field: 'enable', header: '是否启用'},
      {field: 'operating', header: '操作'},
    ];
    this.esDate = this.toolSrv.esDate;
    this.getTollDownLoadInfo('', '', '', '', '');
    const queryData = setInterval(() => {
      this.loadHidden = false;
      if (this.optionTollType.length > 0 && this.enableOption.length > 0) {
        this.tollSrv.queryBfTollPageInfo({pageNo: this.nowPage, pageSize: 10}).subscribe(
          value => {
            console.log(value);
            clearInterval(queryData);
            if (value.status === '1000') {
              this.loadHidden = true;
              if (value.data.contents)  {
                value.data.contents.forEach( v => {
                  if (v.chargeType) {
                    this.optionTollType.forEach( val => {
                      if (v.chargeType.toString() === val.value) {
                        v.chargeType = val.label;
                      }
                    });
                  }
                  if (v.enable !== null) {
                    this.enableOption.forEach( val => {
                      if (v.enable.toString() === val.value) {
                        v.enable = val.label;
                      }
                    });
                  }
                });
              }
              this.tollTableContent = value.data.contents;
              this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
            }
          }
        );
      }
    }, 600);

    this.settollTitleData();
    this.tollTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
  }
  // condition search click
  public  tollSearchClick(): void {
    // @ts-ignore
  }
  // add  toll
  public  tollAddClick(): void {
    this.getTollDownLoadInfo('', '', '', '', '');
    this.tollAddDialog = true;
  }
  // sure add toll
  public  tollAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      if  (this.tollMoreInfo.length === 0) {
        this.tollSrv.queryTollAdd(this.tollTitle).subscribe(
          value => {
            if (value.status === '1000')  {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollAddDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '添加失败,' + value.message);
            }
          }
        );
      } else {
        this.tollMoreInfo.forEach( v => {
          for (const Key in this.tollTitle) {
            const name = Key;
            this.tollAddinfo[name] =  this.tollTitle[Key];
          }
          for (const vKey in v) {
            const vName = vKey;
            this.tollAddinfo[vName] = v[vKey];
          }
          this.tollAdd.push(this.tollAddinfo);
          this.tollAddinfo = new AddToll();
        });
        this.tollSrv.addBfTollInfo({data: this.tollAdd}).subscribe(
          value =>  {
            if (value.status === '1000')  {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollAddDialog = false;
              this.clearData();
            }
          }
        );
      }
    });
  }
  // modify toll
  public  tollModifyClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.tollSelect.length === 1) {
      this.tollChargeTypeMedify = this.tollTitle.chargeType;
      this.tollEnableMedify = this.tollTitle.enable;
      this.toolSrv.getAdminStatus('REFUND', (data) => {
        if (data) {
          this.toolSrv.setDataFormat(data,this.tollTitle.refund, (list, label) => {
            this.refundOption = list;
            if ( label === null) {
              this.tollrefundMedify = '请选择是否可退款';
            } else {
              this.tollrefundMedify = label;
            }
          });
        }
      });
      this.getTollDownLoadInfo( '', '', '', '', '');
      const Time = setInterval( () => {
          clearInterval(Time);
          this.tollSrv.queryTollinfoDetail({chargeCode: this.tollSelect[0].chargeCode}).subscribe(
            value => {
              this.tollMoreInfo = [];
              this.tollModifyDatas = [];
              this.ids = [];
              value.data.forEach( v => {
                this.tollMoreInfo.push({areaMin: v.areaMin, areaMax: v.areaMax, money: v.money, datedif: v.datedif, discount: v.discount, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceType: v.parkingSpaceType});
                this.ids.push({id: v.id});
                if (v.datedif !== null)  {
                  this.tollAddoption.datedif.forEach( val => {
                    if (v.datedif.toString() === val.value) {
                      this.tollModifyData.datedif = val.label;
                    }
                  });
                } else {
                  this.tollModifyData.datedif = '请选择月数';
                }
                if (v.parkingSpaceType !== null && v.parkingSpaceType !== undefined && v.parkingSpaceType !== '') {
                  this.tollAddoption.parkingSpaceType.forEach( val => {
                    if (v.parkingSpaceType.toString() === val.value) {
                      this.tollModifyData.parkingSpaceType = val.label;
                    }
                  });
                }else {
                  this.tollModifyData.parkingSpaceType = '请选择车位性质';

                }
                if (v.parkingSpaceNature !== null && v.parkingSpaceNature !== undefined && v.parkingSpaceNature !== '') {
                  this.tollAddoption.parkingSpaceNature.forEach( val => {
                    if (v.parkingSpaceNature.toString() === val.value) {
                      this.tollModifyData.parkingSpaceNature = val.label;
                    }
                  });
                } else {
                  this.tollModifyData.parkingSpaceNature = '请选择车位类型';
                }
                this.tollModifyDatas.push(this.tollModifyData);
                this.tollModifyData = new ModifyTollDrop();
              });
            }
          );
      }, 100);
      this.tollModifyDialog = true;
    } else {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    }
  }
  // sure modify toll
  public  tollModifySureClick(): void {
    this.optionTollType.forEach( val => {
      if (this.tollTitle.chargeType.toString() === val.label) {
        this.tollTitle.chargeType = val.value;
      }
    });
    console.log(this.tollTitle);
    this.enableOption.forEach( val => {
      if (this.tollTitle.enable.toString() === val.label) {
        this.tollTitle.enable = val.value;
      }
    });
    this.toolSrv.setConfirmation('修改', '修改', () => {
      if (this.tollMoreInfo.length === 0) {
        this.tollSrv.updateTollInfo(this.tollTitle).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollModifyDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
            }
          }
        );
      } else {
          this.modifytoll = [];
          this.tollMoreInfo.forEach( (v, index) => {
          for (const Key in this.tollTitle) {
            this.tollAddinfo[Key] =  this.tollTitle[Key];
           }
          for (const vKey in v) {
            this.tollAddinfo[vKey] = v[vKey];
          }
          if (index + 1 <= this.ids.length) {
            this.tollAddinfo.id = this.ids[index].id;
          } else {
            this.tollAddinfo.id = null;
          }
          this.modifytoll.push(this.tollAddinfo);
          this.tollAddinfo = new AddToll();
        });
        this.tollSrv.updateTollListinfo({data: this.modifytoll}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', value.message);
              this.tollInitialization();
              this.tollModifyDialog = false;
              this.clearData();
            } else {
              this.toolSrv.setToast('error', '操作错误', '修改失败,' + value.message);
            }
          }
        );
      }
    });
  }
  // delete toll
  public  tollDeleteClick(): void {
    if (this.tollSelect === undefined || this.tollSelect.length === 0) {
      this.toolSrv.setToast('error',  '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.tollSelect.length}项`, () => {
        this.tollSelect.forEach( v => {
          this.deleteId.push({chargeCode: v.chargeCode});
        });
        this.tollSrv.deleteTollinfo({data: this.deleteId}).subscribe(
          value => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success',  '操作成功', '添加成功' + value.message);
              this.clearData();
              this.tollInitialization();
            } else {
              this.toolSrv.setToast('error', '操作错误', '删除失败,' + value.message);
            }
          }
        );
      });
    }
  }
  // select toll
  public  tollonRowSelect(e): void {
    this.tollModify = e.data;
    this.tollTitle = e.data;
  }
  // show Detail Dialog
  public  toolDetailClick(e): void {
    this.tollTitle = e;
    this.toolSrv.getAdminStatus('REFUND', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, e.refund, (list, label) => {
          this.tollrefundMedify = label;
        });
      }
    });
    this.getTollDownLoadInfo( e.chargeType, e.enable, '', '', '');
    const detailData = setInterval(() => {
        this.tollSrv.queryTollinfoDetail({chargeCode: e.chargeCode}).subscribe(
          value => {
            this.tollMoreInfo = [];
            this.tollModifyDatas = [];
            clearInterval(detailData);
            value.data.forEach( v => {
              this.tollMoreInfo.push({areaMin: v.areaMin, areaMax: v.areaMax, money: v.money, datedif: v.datedif, discount: v.discount, parkingSpaceNature: v.parkingSpaceNature, parkingSpaceType: v.parkingSpaceType});
              if (v.datedif !== null && v.datedif !== undefined && v.datedif !== '')  {
                this.tollAddoption.datedif.forEach( val => {
                  if (v.datedif.toString() === val.value) {
                    this.tollModifyData.datedif = val.label;
                  }
                });
              }
              if (v.parkingSpaceType !== null && v.parkingSpaceType !== undefined && v.parkingSpaceType !== '') {
                this.tollAddoption.parkingSpaceType.forEach(val => {
                  if (v.parkingSpaceType.toString() === val.value) {
                    this.tollModifyData.parkingSpaceType = val.label;
                  }
                });
              }
              if (v.parkingSpaceNature !== null && v.parkingSpaceNature !== undefined && v.parkingSpaceNature !== '') {
                this.tollAddoption.parkingSpaceNature.forEach(val => {
                  if (v.parkingSpaceNature.toString() === val.value) {
                    this.tollModifyData.parkingSpaceNature = val.label;
                  }
                });
              }
              this.tollModifyDatas.push(this.tollModifyData);
              this.tollModifyData = new ModifyTollDrop();
            });
          }
        );
    }, 500);
    this.tollDetailDialog = true;
  }
  // Reset data
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
      this.tollAddoption = {parkingSpaceNature: [], parkingSpaceType: [], datedif: []};
      this.enableOption = [];
      this.refundOption = [];
      this.optionTollType = [];
  }
  // Add a piece of data
  public  addMoreTollClick(): void {
      this.tollMoreInfo.push({areaMin: '', areaMax: '', money: '', datedif: '', discount: '10', parkingSpaceNature: '', parkingSpaceType: ''});
      this.tollModifyData.datedif = '请选择月数';
      this.tollModifyData.parkingSpaceNature = '请选择车位性质';
      this.tollModifyData.parkingSpaceType = '请选择车位类型';
      this.tollModifyDatas.push(this.tollModifyData);
  }
  // delete moreTollMore
  public deleteTollMoreClick(index, e): void {
    if (index + 1 > this.ids.length) {
      this.ids.splice(index, 1);
      this.tollMoreInfo.splice(index, 1);
    } else {
      this.tollSrv.deleteTollList({id: this.ids[index].id}).subscribe(
        value => {
          if (value.status === '1000') {
            // console.log();
            this.ids.splice(index, 1);
            this.tollMoreInfo.splice(index, 1);
          } else {
            this.toolSrv.setToast('error', '删除失败', value.message);
          }
        }
      );
    }
  }
  // paging query
  public  getTollDownLoadInfo(chargeType, enable, datedif, nature, type): void {

    this.toolSrv.getAdminStatus('CHARGE_TYPE', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, chargeType, (list, label) => {
          this.optionTollType = list;
        });
      }
    });
    this.toolSrv.getAdminStatus('ENABLED', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, enable, (list, label) => {
          this.enableOption = list;
        });
      }
    });
    this.toolSrv.getAdminStatus('DATEDIF', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, datedif, (list, label) => {
          this.tollAddoption.datedif = list;
        });
      }
    });
    this.toolSrv.getNativeStatus('CWXZ', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, nature, (list, label) => {
          this.tollAddoption.parkingSpaceNature = list;
        });
      }
    });
    this.toolSrv.getNativeStatus('CWLX', (data) => {
      if (data) {
        this.toolSrv.setDataFormat(data, type, (list, label) => {
          this.tollAddoption.parkingSpaceType = list;
        });
      }
    });
  }
  // set tollTitledata
  public  settollTitleData(): void {
    this.tollTitle.chargeCode = '';
    this.tollTitle.enable = '';
    this.tollTitle.chargeType = '';
    this.tollTitle.refund = '';
    this.tollTitle.chargeUnit = '';
    this.tollTitle.chargeStandard = '';
    this.tollTitle.chargeName = '';
    this.tollTitle.id = '';
  }
  // paging query
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
}
