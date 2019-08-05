import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {Addconfig, Modifyconfig, SetConfig} from '../../../common/model/set-config.model';
import {SetConfigService} from '../../../common/services/set-config.service';
import {isObjectFlagSet} from 'tslint';
import {Dropdown} from 'primeng/primeng';
import {PublicMethedService} from '../../../common/public/public-methed.service';
import {TableOption} from '../../../common/components/basic-table/table.model';

@Component({
  selector: 'rbi-set-config',
  templateUrl: './set-config.component.html',
  styleUrls: ['./set-config.component.less']
})
export class SetConfigComponent implements OnInit {
  @ViewChild('addSetType', {static: true}) addSetType: Dropdown;
  public configTableTitleStyle: any;
  public optionTable: TableOption = new TableOption();
  public configSelect: SetConfig[];
  // 添加相关
  public configAddDialog: boolean;
  public configAdd: Addconfig = new Addconfig();
  // 修改相关
  public configModifyDialog: boolean;
  public configModify: Modifyconfig = new Modifyconfig();
  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  public setTypeOption: any[] = [];
  public loadHidden = true;
  public nowPage = 1;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private configService: SetConfigService,
    private toolSrv: PublicMethedService,
  ) { }
  ngOnInit() {
    this.configInitialization();
  }

  // initialization config
  public  configInitialization(): void {
    this.loadHidden = false;
    this.configService.querySetPage({pageNo: this.nowPage, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        console.log(value);
        if (value.status === '1000') {
          this.setTableOption(value.data.contents);
          this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        } else {
          this.toolSrv.setToast('error', '查询失败', value.message);
        }

      }
    );

    this.configService.getSetType({}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.setTypeOption.push({label: v.settingName, value: v.settingCode});

        });
      }
    );

    this.configTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // show add config dialog
  public  configAddClick(): void {
    this.configAddDialog = true;
  }
  // sure add config
  public  configAddSureClick(): void {
    this.toolSrv.setConfirmation('增加', '增加', () => {
      this.loadHidden = false;

      this.configService.addSet(this.configAdd).subscribe(
        (value) => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.toolSrv.setToast('success', '操作成功', '添加成功');
            this.configInitialization();
            this.configAddDialog = false;
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    });
  }
  // close add config dialog
  public configAddCloseClick(): void {
      this.initializationData();
      this.configAddDialog = false;
      this.configInitialization();
  }
  // show modify config dialog
  public configModifyClick(): void {
    if (this.configSelect === undefined || this.configSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.configSelect.length === 1) {
      this.configModifyDialog = true;
      this.configModify.id = this.configSelect[0].id;
      this.configModify.settingType = this.configSelect[0].settingType;
      this.configModify.settingCode = this.configSelect[0].settingCode;
      this.configModify.settingName = this.configSelect[0].settingName;
      this.configModify.organizationId = this.configSelect[0].organizationId;
      this.configModify.udt = this.configSelect[0].udt;
      this.configModify.status = this.configSelect[0].status;
      this.configModify.idt = this.configSelect[0].idt;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // sure modify config
  public  configModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.loadHidden = false;
      this.setTypeOption.forEach( v => {
        if (this.configModify.settingType === v.label) {
          this.configModify.settingType = v.value;
        }
      });
      this.configService.updateSet(this.configModify).subscribe(
        (value) => {
          this.loadHidden = true;
          if (value.status === '1000') {
            this.configInitialization();
            this.toolSrv.setToast('success', '操作成功', '修改成功');
            this.configModifyDialog = false;
            this.initializationData();
            this.configSelect = [];
          } else {
            this.toolSrv.setToast('error', '操作失败', value.message);
          }
        }
      );
    });
  }
  // close modify congfig dialog
  public  configModifyCloseClick(): void {
    this.initializationData();
    this.configModifyDialog = false;
    this.configInitialization();
  }
  // delete config
  public  configDeleteClick(): void {
    if (this.configSelect === undefined || this.configSelect.length === 0) {
        this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.configSelect.length}项`, () => {
        this.loadHidden = false;
        if (this.configSelect.length === 1) {
          this.configService.delectSet({id: this.configSelect[0].id}).subscribe(
            (value) => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.configInitialization();
                this.toolSrv.setToast('success', '操作成功', '删除成功');
                this.configSelect = [];
              } else {
                this.toolSrv.setToast('error', '操作失败', value.message);
              }
            }
          );
        } else if (this.configSelect.length > 1) {
          this.configSelect.forEach(v => {
            this.ids.push({id: v.id});
          });
          this.configService.deletemoreSet({data: this.ids}).subscribe(
            (value) => {
              this.loadHidden = true;
              if (value.status === '1000') {
                this.configInitialization();
                this.toolSrv.setToast('success', '操作成功', '删除成功');
                this.configSelect = [];
              } else {
                this.toolSrv.setToast('error', '操作失败', value.message);
              }
            }
          );
        }
      });
    }
  }
  // Select setting type
  public  setTypeChange(e): void {
    this.configAdd.settingType = e.value;
  }
  // Reset data
  public initializationData(): void {
    this.configSelect = [];
    this.configAdd = new Addconfig();
    this.configModify = new Modifyconfig();
    this.setTypeOption = [];
    this.addSetType.value = null;
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    this.nowPage = event;
    this.configService.querySetPage({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.setTableOption(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.configSelect = [];
  }
  // seting table data
  public  setTableOption(data): void {
    this.optionTable.btnHidden = false;
    this.optionTable.content = data;
    this.optionTable.header = [
      {field: 'settingCode', header: '设置编号'},
      {field: 'settingName', header: '设置名称'},
      {field: 'settingType', header: '设置类型'},
    ];
  }
  
  public  getSelectData(e): void {
      this.configSelect = e;
  }
}
