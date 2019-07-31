import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {AddSetPart, ModifySetPart, SetPart} from '../../../common/model/set-part.model';
import {SetPartService} from '../../../common/services/set-part.service';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-set-part',
  templateUrl: './set-part.component.html',
  styleUrls: ['./set-part.component.less']
})
export class SetPartComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public partTableTitle: any;
  public partTableContent: SetPart[];
  public partTableTitleStyle: any;
  public partSelect: SetPart[];
  // 添加相关
  public partAddDialog: boolean;
  public partAdd: AddSetPart = new AddSetPart();
  // 修改相关
  public partModifyDialog: boolean;
  public partModify: ModifySetPart = new ModifySetPart();
  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
  constructor(
    private partSrv: SetPartService,
    private toolSrv: PublicMethedService,
  ) { }
  ngOnInit() {
    this.partInitialization();
  }

  // initialization part
  public  partInitialization(): void {
    this.loadHidden = false;
    this.partTableTitle = [
      {field: 'id', header: 'id'},
      {field: 'roleCode', header: '权限编号'},
      {field: 'roleName', header: '权限名称'},
      {field: 'remark', header: '备注'},
    ];
    this.partSrv.queryPartPageData({pageNo: 1, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.partTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.partTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  // public  partSearchClick(): void {
  //   // @ts-ignore
  //   console.log(this.input.nativeElement.value);
  //   console.log('这里是条件搜索');
  // }
  // add  part
  // show part add dialog
  public  partAddClick(): void {
    this.partAddDialog = true;
  }
  // add part
  public  partAddSureClick(): void {
    if (this.partAdd.roleName !== undefined) {
      this.toolSrv.setConfirmation('增加', '增加', () => {
        this.loadHidden = false;
        this.partSrv.addPart(this.partAdd).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.loadHidden = true;
              this.partAddDialog = false;
              this.toolSrv.setToast('success', '操作成功', '角色添加成功');
              this.partInitialization();
            } else  {
              this.toolSrv.setToast('error', '新增失败', value.message);
            }
          }
        );
      });
    } else {
      this.toolSrv.setToast('error' , '操作错误', '未填写角色名称');
    }
  }
  // close add part dialog
  public partAddCloseClick(): void {
    this.initializationData();
    this.partAddDialog = false;
    this.partInitialization();
  }
  // show part modify dialog
  public partModifyClick(): void {
    if (this.partSelect === undefined || this.partSelect.length === 0 ) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要修改的项');
    } else if (this.partSelect.length === 1) {
      this.partModifyDialog = true;
      this.partModify.id = this.partSelect[0].id;
      this.partModify.organizationId = this.partSelect[0].organizationId;
      this.partModify.roleCode = this.partSelect[0].roleCode;
      this.partModify.roleName = this.partSelect[0].roleName;
      this.partModify.remark = this.partSelect[0].remark;
      this.partModify.idt = this.partSelect[0].idt;
      this.partModify.udt = this.partSelect[0].udt;
    } else {
      this.toolSrv.setToast('error', '操作错误', '只能选择一项进行修改');
    }
  }
  // modify part
  public  partModifySureClick(): void {
    this.toolSrv.setConfirmation('修改', '修改', () => {
      this.partSrv.updatePart(this.partModify).subscribe(
        (value) => {
          if (value.status === '1000') {
            this.partModifyDialog = false;
            this.toolSrv.setToast('success', '操作成功', '角色信息修改成功');
            this.initializationData();
            this.partInitialization();
          } else {
            this.toolSrv.setToast('error', '修改失败', value.message);
          }
        }
      );
    });
  }
  // close modify dialog
  public  partModifyCloseClick(): void {
    this.initializationData();
    this.partModifyDialog = false;
  }
  // delete part
  public  partDeleteClick(): void {
    if (this.partSelect === undefined || this.partSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.partSelect.length}项`, () => {
        this.partSelect.forEach(v => {
          this.ids.push(v.id);
        });
        this.partSrv.deletePart({ids: this.ids.join(',')}).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '操作成功', '角色信息修改成功');

              this.initializationData();
              this.partInitialization();
            } else {
              this.toolSrv.setToast('error', '删除失败', value.message);
            }

          }
        );
      });
    }
  }
  // public  setUserTypeChange(e): void {
  //   this.partAdd.settingType = e.value;
  //   this.partModify.settingType = e.value;
    // console.log(e);
    // this.userCode = e.value;
  // }

  // initialization data
  public initializationData(): void {
    this.partSelect = [];
    this.partAdd = new AddSetPart();
    this.partModify = new ModifySetPart();
    this.setlimitCodeOption = [];
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.partSrv.queryPartPageData({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.partTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      });
    this.partSelect = [];
  }
}
