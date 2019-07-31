import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddStaff, DepartTree, ModifyStaff, Staff} from '../../../common/model/bf-staff.model';
import {BfStaffService} from '../../../common/services/bf-staff.service';
import {TreeNode} from '../../../common/model/shared-model';
import {DatePipe} from '@angular/common';
import {last} from 'rxjs/operators';

@Component({
  selector: 'rbi-bf-staff',
  templateUrl: './bf-staff.component.html',
  styleUrls: ['./bf-staff.component.less']
})
export class BfStaffComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public staffTableTitle: any;
  public staffTableContent: Staff[];
  public staffTableTitleStyle: any;
  public staffSelect: any;
  // 添加相关
  public staffAddDialog: boolean;
  public staffAdd: AddStaff = new AddStaff();
  public enableOption: any[] = [];
  public loginStatusOption: any[] = [];
  public educationalOption: any[] = [];
  public politicalStatusOption: any[] = [];
  public maritalOption: any[] = [];
  // 修改相关
  public staffModifayDialog: boolean;
  public staffModifay: ModifyStaff = new ModifyStaff();
  public enableModifyDrapPlaceholder: any;
  public loginStatusModifyDrapPlaceholder: any;
  public educationalModifyDrapPlaceholder: any;
  public politicalStatusModifyDrapPlaceholder: any;
  public maritalModifyDrapPlaceholder: any;
   // 详情相关
  public staffDetailDialog: boolean;
  public staffDetail: ModifyStaff = new ModifyStaff();
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public esDate: any; // 日期参数
  public option: any; // 分页
  public nowPage = 1; // 分页
  public loadHidden = true;
  public deleteId = [];
  // depart tree
  public departDialog: boolean;
  public departTrees: DepartTree[];
  public departTree: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private staffSrv: BfStaffService,
    private datePipe: DatePipe,
  ) { }
  ngOnInit() {
    this.staffInitialization();
  }

  // initialization staff
  public  staffInitialization(): void {
    console.log('这里是信息的初始化');
    this.staffTableTitle = [
      {field: 'userId', header: '用户ID'},
      {field: 'realName', header: '员工姓名'},
      {field: 'sex', header: '性别'},
      {field: 'mobilePhone', header: '手机号码'},
      // {field: 'udt', header: '更新时间'},
      {field: 'organizationName', header: '组织/机构名称'},
      {field: 'departmentName', header: '部门名称'},
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
    this.loadHidden = false;
    this.staffSrv.queryStaffInfoPage({pageNo: this.nowPage, pageSize: 10 }).subscribe(
      value => {
        this.loadHidden = true;
        this.staffTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.staffTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.staffSelect);
  }
  // condition search click
  public  staffSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add staff
  public  staffAddClick(): void {
    this.staffSrv.queryStaffStatus({settingType: 'ENABLED'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.enableOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'LOGIN_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.loginStatusOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'EDUCATIONAL_BACKGROUND'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.educationalOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'POLITICAL_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.politicalStatusOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'MARITAL_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            this.maritalOption.push({label: v.settingName, value: v.settingCode});
          });
        }
      }
    );
    this.staffAddDialog = true;
    console.log('这里是添加信息');
  }
  public  DepartTreeClick(): void {
    this.departDialog = true;
    this.staffSrv.queryDepartTree({}).subscribe(
      value => {
        console.log(value);
        this.departTrees = this.initializeTree(value.data);
      }
    );
  }
  public  treeSelectDepartClick(): void {
     this.staffAdd.departmentId = this.departTree.value;
     this.staffAdd.departmentName = this.departTree.label;
     this.staffModifay.departmentId = this.departTree.value;
     this.staffModifay.departmentName = this.departTree.label;
     this.departDialog = false;
  }
  // sure add staff
  public  staffAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.staffAdd.birthday = this.datePipe.transform(this.staffAdd.birthday , 'yyyy-MM-dd');
        this.staffAdd.hiredate = this.datePipe.transform(this.staffAdd.hiredate , 'yyyy-MM-dd');
        console.log(this.staffAdd);
        this.staffSrv.addStaffInfo(this.staffAdd).subscribe(
          value => {
            console.log(value);
            if (value.status === '1000') {
              this.staffAddDialog = false;
              this.setToast('success',  '操作成功', value.message);
              this.clearData();
              this.staffInitialization();
            } else {
              this.setToast('error',  '操作失败', value.message);
            }
          }
        );
      },
      reject: () => {
      }
    });
  }
  // modify staff
  public  staffModifyClick(): void {
    console.log(this.staffSelect);
    if (this.staffSelect === undefined || this.staffSelect.length === 0 ) {
      this.setToast('error',  '操作错误',  '请选择需要修改的项');

    } else if (this.staffSelect.length === 1) {
      this.staffSrv.queryStaffStatus({settingType: 'ENABLED'}).subscribe(
        value => {
          if (value.data.length > 0) {
            value.data.forEach( v => {
              this.enableOption.push({label: v.settingName, value: v.settingCode});
              if (this.staffModifay.enabled.toString() === v.settingCode) {
                this.enableModifyDrapPlaceholder = v.settingName;
              }
            });
          }
        }
      );
      this.staffSrv.queryStaffStatus({settingType: 'LOGIN_STATUS'}).subscribe(
        value => {
          if (value.data.length > 0) {
            value.data.forEach( v => {
              this.loginStatusOption.push({label: v.settingName, value: v.settingCode});
              if (this.staffModifay.loginStatus.toString() === v.settingCode) {
                this.loginStatusModifyDrapPlaceholder = v.settingName;
              }
            });
          }
        }
      );
      this.staffSrv.queryStaffStatus({settingType: 'EDUCATIONAL_BACKGROUND'}).subscribe(
        value => {
          if (value.data.length > 0) {
            value.data.forEach( v => {
              this.educationalOption.push({label: v.settingName, value: v.settingCode});
              if (this.staffModifay.educationalBackground.toString() === v.settingCode) {
                this.educationalModifyDrapPlaceholder = v.settingName;
              }
            });
          }
        }
      );
      this.staffSrv.queryStaffStatus({settingType: 'POLITICAL_STATUS'}).subscribe(
        value => {
          if (value.data.length > 0) {
            value.data.forEach( v => {
              this.politicalStatusOption.push({label: v.settingName, value: v.settingCode});
              if (this.staffModifay.politicalStatus.toString() === v.settingCode) {
                this.politicalStatusModifyDrapPlaceholder = v.settingName;
              }
            });
          }
        }
      );
      this.staffSrv.queryStaffStatus({settingType: 'MARITAL_STATUS'}).subscribe(
        value => {
          if (value.data.length > 0) {
            value.data.forEach( v => {
              this.maritalOption.push({label: v.settingName, value: v.settingCode});
              if (this.staffModifay.maritalStatus.toString() === v.settingCode) {
                this.maritalModifyDrapPlaceholder = v.settingName;
              }
            });
          }
        }
      );
      this.staffModifayDialog = true;
      console.log('这里是修改信息');
    } else {
      this.setToast('error',  '操作错误',  '只能选择一项进行修改');
    }
  }
  // sure modify staff
  public  staffModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.staffModifay.birthday = this.datePipe.transform(this.staffModifay.birthday , 'yyyy-MM-dd');
        this.staffModifay.hiredate = this.datePipe.transform(this.staffModifay.hiredate , 'yyyy-MM-dd');
        console.log(this.staffModifay);
        this.staffSrv.updateStaffInfo(this.staffModifay).subscribe(
          value => {
            console.log(value);
            if (value.status === '1000') {
              this.staffModifayDialog = false;
              this.setToast('success',  '操作成功', value.message);
              this.clearData();
              this.staffInitialization();
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

  // delete staff
  public  staffDeleteClick(): void {
    if (this.staffSelect === undefined || this.staffSelect.length === 0) {
      this.setToast('error',  '操作错误',  '请选择需要删除的项');
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.staffSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.staffSelect);
          this.staffSelect.forEach( v => {
            this.deleteId.push({id: v.id});
          });
          this.staffSrv.deleteStaffInfo({data: this.deleteId}).subscribe(
            value => {
              if (value.status === '1000') {
                this.setToast('success', '操作成功', value.message);
                this.clearData();
                this.staffInitialization();
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
  public  treeOnNodeSelect(e): void {
    console.log(e);
  }
  // select staff
  public  staffonRowSelect(e): void {
    // console.log(e.data);
    this.staffModifay = e.data;
    // console.log(this.staffModifay);
  }

  // see staffinfo detail
  public  staffDetailClick(e): void {
      // console.log(e);
    this.staffDetail = e;
    this.staffSrv.queryStaffStatus({settingType: 'ENABLED'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.staffDetail.enabled.toString() === v.settingCode) {
              this.enableModifyDrapPlaceholder = v.settingName;
            }
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'LOGIN_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.staffDetail.loginStatus.toString() === v.settingCode) {
              this.loginStatusModifyDrapPlaceholder = v.settingName;
            }
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'EDUCATIONAL_BACKGROUND'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.staffDetail.educationalBackground.toString() === v.settingCode) {
              this.educationalModifyDrapPlaceholder = v.settingName;
            }
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'POLITICAL_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.staffDetail.politicalStatus.toString() === v.settingCode) {
              this.politicalStatusModifyDrapPlaceholder = v.settingName;
            }
          });
        }
      }
    );
    this.staffSrv.queryStaffStatus({settingType: 'MARITAL_STATUS'}).subscribe(
      value => {
        if (value.data.length > 0) {
          value.data.forEach( v => {
            if (this.staffDetail.maritalStatus.toString() === v.settingCode) {
              this.maritalModifyDrapPlaceholder = v.settingName;
            }
          });
        }
      }
    );
    this.staffDetailDialog = true;
  }

  // 数据格式化
  public initializeTree(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.label = data[i].deptName;
      childnode.value = data[i].deptId;
      if (data[i].department2DTO != null && data[i].department2DTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].department2DTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }
  public clearData(): void {
      this.staffAdd = new AddStaff();
      this.staffModifay = new AddStaff();
      this.staffSelect = [];
      this.maritalOption = [];
      this.enableOption = [];
      this.politicalStatusOption = [];
      this.loginStatusOption = [];
      this.educationalOption = [];
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
  public  nowpageEventHandle(event: any): void {
    this.loadHidden = false;
    console.log(event);
    this.nowPage = event;
    this.staffSrv.queryStaffInfoPage({pageNo: this.nowPage, pageSize: 10 }).subscribe(
      value => {
        // console.log(value);
        this.loadHidden = true;
        this.staffTableContent = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.staffTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // this.paymentSelect = [];
  }
}
