import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {AddSetRole, ModifySetRole, SetRole} from '../../../common/model/set-role.model';
import {SetRoleService} from '../../../common/services/set-role.service';
import {isObjectFlagSet} from 'tslint';
import {PublicMethedService} from '../../../common/public/public-methed.service';

@Component({
  selector: 'rbi-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less']
})
export class SetRoleComponent implements OnInit {
  public roleTableTitle: any;
  public roleTableContent: SetRole[];
  public roleTableTitleStyle: any;
  public roleSelect: SetRole[];
  // 添加相关
  public roleAddDialog: boolean;
  public roleAdd: AddSetRole = new AddSetRole();
  public RoleCodeList: any[] = [];
  public primitList: any[] = [];
  public userCode: any;
  public roleDatas: any[] = [];
  public roleData: any[] = [];

  // 删除相关
  public ids: any[] = [];
  // 其他相关
  public option: any;
  public setlimitCodeOption: any[] = [];
  public loadHidden = true;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private roleSrv: SetRoleService,
    private toolSrv: PublicMethedService
  ) { }
  ngOnInit() {
    this.roleInitialization();
  }

  // initialization role
  public  roleInitialization(): void {
    this.loadHidden = false;
    this.roleTableTitle = [
      {field: 'userId', header: '用户ID'},
      {field: 'username', header: '用户名称'},
      {field: 'realName', header: '真实姓名'},
      {field: 'roleCode', header: '角色编码'},
      {field: 'roleName', header: '角色名称'},
      // {field: 'remark', header: '备注'},
    ];
    this.roleSrv.queryRoleList({pageNo: 1, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.roleTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.roleTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // // condition search click
  // public  roleSearchClick(): void {
  //   // @ts-ignore
  //   console.log(this.input.nativeElement.value);
  //   console.log('这里是条件搜索');
  // }
  // showe add  role dialog
  public  roleConfigClick(): void {
    this.primitList = [];
    this.RoleCodeList = [];
    this.loadHidden = false;
    this.roleSrv.queryUserInfo({}).subscribe(
      (value) => {
        this.loadHidden = true;
        value.data.forEach( v => {
          this.RoleCodeList.push({label: v.realName, value: v.userId});
        });
        this.roleAddDialog = true;
      }
    );
    this.roleSrv.queryRoleInfo({}).subscribe(
      (value) => {
        value.data.forEach( v => {
          this.primitList.push({label: v.roleName, value:  v.roleCode});
        });
        this.loadHidden = true;

      }
    );
  }
  // add role quest
  public  roleAddSureClick(): void {
    const flag = [];

    if (this.userCode !== undefined && this.roleDatas !== []) {
      this.toolSrv.setConfirmation('增加', '增加', () => {
        this.roleData.forEach(v => {
          this.roleDatas.forEach( item => {
            if (v === item) {
              flag.push(v);
              this.roleDatas.splice( this.roleDatas.indexOf(item), 1);
            }
          });
        });

        flag.forEach(item => {
          this.roleData.forEach( v => {
            if (v === item) {
              this.roleData.splice(this.roleData.indexOf(v), 1);
            }
          });
        });


        if (this.roleDatas.length >= 1) {
          this.roleSrv.addUserRole({userId: this.userCode , roleCodes: this.roleDatas.join(',')}).subscribe(
            (value ) => {
              if (value.status === '1000') {
                this.toolSrv.setToast('success', '操作成功', '新增成功');
                this.roleAddDialog = false;
                this.roleInitialization();
                this.initializationData();
              } else  {
                this.toolSrv.setToast('error', '新增失败', value.message);
              }
            }
          );
        }
        if (this.roleData.length >= 1) {
          this.loadHidden = false;
          this.roleTableContent.forEach(v => {
            this.roleData.forEach(item => {
              if (this.userCode === v.userId) {
                if (v.roleCode === item) {
                  this.ids.push(v.id);
                }
              }
            });
          });
          this.roleSrv.deleteUserInfo({ids: this.ids.join(',')}).subscribe(
            (value) => {
              if (value.status === '1000') {
                this.roleInitialization();
                this.toolSrv.setToast('success', '操作成功', '删除成功');
                this.roleAddDialog = false;

                this.roleSelect = [];
              } else {
                this.toolSrv.setToast('error', '操作失败', value.message);
              }
            }
          );
        }
      });
    } else {
      this.toolSrv.setToast('error' , '操作错误', '未选择数据');
    }
  }
  // close add role dialog
  public roleAddCloseClick(): void {
    this.initializationData();
    this.roleAddDialog = false;
    this.RoleCodeList = [];
    this.roleInitialization();
  }
  // delete role data
  public  roleDeleteClick(): void {
    if (this.roleSelect === undefined || this.roleSelect.length === 0) {
      this.toolSrv.setToast('error', '操作错误', '请选择需要删除的项');
    } else {
      this.toolSrv.setConfirmation('删除', `删除这${this.roleSelect.length}项`, () => {
        this.roleSelect.forEach(v => {
          this.ids.push(v.id);
        });
        this.roleSrv.deleteUserInfo({ids: this.ids.join(',')}).subscribe(
          (value) => {
            if (value.status === '1000') {
              this.roleInitialization();
              this.toolSrv.setToast('success', '操作成功', '删除成功');
              // this.roleModifyDialog = false;
              this.roleSelect = [];
            } else {
              this.toolSrv.setToast('error', '操作失败', value.message);
            }
          }
        );
      });
    }
  }
  // Select user type
  public  setUserTypeChange(e): void {
    this.userCode = e.value;
    this.roleSrv.queryRoleInfo({}).subscribe(
      (value) => {
        this.primitList = [];
        value.data.forEach( v => {
          this.primitList.push({label: v.roleName, value:  v.roleCode});
        });
        this.loadHidden = true;

      }
    );
    this.roleSrv.queryUserRole({userId: e.value}).subscribe(
      (value) => {
        this.roleDatas = [];
        value.data.forEach( v => {
          this.roleDatas.push(v.roleCode);
          this.roleData = this.roleDatas;
        });
      }
    );
  }
  // initialization data
  public initializationData(): void {
    this.roleSelect = [];
    this.roleAdd = new AddSetRole();
    this.setlimitCodeOption = [];
    this.roleDatas = [];
    this.userCode = '';
  }
  // paging query
  public  nowpageEventHandle(event: any): void {
    this.roleSrv.queryRoleList({pageNo: event, pageSize: 10}).subscribe(
      (value) => {
        this.loadHidden = true;
        this.roleTableContent = value.data.contents;
        // console.log(this.roleTableContent);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        // console.log(123);
      }
    );
    this.roleSelect = [];
  }
}
