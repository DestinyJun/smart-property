import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Workgroup} from '../../../common/model/bf-workgroup.model';

@Component({
  selector: 'rbi-bf-workgroup',
  templateUrl: './bf-workgroup.component.html',
  styleUrls: ['./bf-workgroup.component.less']
})
export class BfWorkgroupComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public workgroupTableTitle: any;
  public workgroupTableContent: Workgroup[];
  public workgroupTableTitleStyle: any;
  public workgroupSelect: any;
  // 添加相关
  public workgroupAddDialog: boolean;
  public workgroupAdd: any;
  // 修改相关
  public workgroupModifayDialog: boolean;
  public workgroupModifay: any;

  // 其他相关
  public cleanTimer: any; // 清除时钟
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit() {
    this.workgroupInitialization();
  }

  // initialization workgroup
  public  workgroupInitialization(): void {
    console.log('这里是信息的初始化');
    this.workgroupTableTitle = [
      {field: 'groupCode', header: '组编号'},
      {field: 'groupName', header: '组名称'},
      {field: 'groupType', header: '组类型'},
      {field: 'organizationCode', header: '组织编号'},
      {field: 'departmentCode', header: '部门编号'},
      {field: 'regulatoryBuilding', header: '监管楼宇'}
    ];
    this.workgroupTableContent = [
      { groupCode: 1, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 2, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 3, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 4, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 5, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 6, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 7, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 8, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 9, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 10, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 11, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 12, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 13, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},
      { groupCode: 14, groupName: '装修组', groupType: '装修', organizationCode: '123', departmentCode: 'a223', regulatoryBuilding: '2403'},

    ];
    this.workgroupTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.workgroupSelect);

  }
  // condition search click
  public  workgroupSearchClick(e): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add workgroup
  public  workgroupAddClick(): void {
    this.workgroupAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add workgroup
  public  workgroupAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.workgroupSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify workgroup
  public  workgroupModifyClick(): void {
    console.log(this.workgroupSelect);
    if (this.workgroupSelect === undefined || this.workgroupSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.workgroupSelect.length === 1) {
      this.workgroupModifayDialog = true;
      console.log('这里是修改信息');
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
  // sure modify workgroup
  public  workgroupModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.workgroupSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  // delete workgroup
  public  workgroupDeleteClick(): void {
    if (this.workgroupSelect === undefined || this.workgroupSelect.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.workgroupSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.workgroupSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select workgroup
  public  workgrouponRowSelect(e): void {
    // console.log(e.data);
    this.workgroupModifay = e.data;
    console.log(this.workgroupModifay);

  }

}
