import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddUnitinfo, ModifyUnitinfo, Unitinfo} from '../../../common/model/bf-unitinfo.model';
import {BfUnitinfoService} from '../../../common/services/bf-unitinfo.service';

@Component({
  selector: 'rbi-bf-unitinfo',
  templateUrl: './bf-unitinfo.component.html',
  styleUrls: ['./bf-unitinfo.component.less']
})
export class BfUnitinfoComponent implements OnInit {
  @ViewChild('input', {static: true}) input: Input;
  public  unitinfoTableTitle: any;
  public  unitinfoTableContent: Unitinfo[];
  public  unitinfoTableTitleStyle: any;
  public  unitinfoSelect: any;
  // 添加相关
  public  unitinfoAddDialog: boolean;
  public  unitinfoAdd: AddUnitinfo = new AddUnitinfo();
  // 修改相关
  public  unitinfoModifayDialog: boolean;
  public  unitinfoModifay: ModifyUnitinfo = new ModifyUnitinfo();

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private unitinfoService: BfUnitinfoService
  ) { }
  ngOnInit() {
    this. unitinfoInitialization();
  }

  // initialization  unitinfo
  public   unitinfoInitialization(): void {
    console.log('这里是信息的初始化');
    this. unitinfoTableTitle = [
      {field: 'unitCode', header: '单元编号'},
      {field: 'unitName', header: '单元名称'},
      {field: 'buildingId', header: '楼宇ID'},
      {field: 'idt', header: '插入时间'},
      {field: 'udt', header: '操作时间'},
    ];
    this.unitinfoService.SearchUnitinfo({}).subscribe(
      (value) => {
        console.log(value);
        this. unitinfoTableContent = value.data;
        this.option = {total: 15, row: 10, nowpage: 1};
      }
    )
    this. unitinfoTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this. unitinfoSelect);

  }
  // condition search click
  public   unitinfoSearchClick(e): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  unitinfo
  public   unitinfoAddClick(): void {
    this.unitinfoAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add  unitinfo
  public   unitinfoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this. unitinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify unitinfo
  public   unitinfoModifyClick(): void {
    console.log(this.unitinfoSelect);
    if (this.unitinfoSelect === undefined || this.unitinfoSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.unitinfoSelect.length === 1) {
      this.unitinfoModifayDialog = true;
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
  // sure modify unitinfo
  public  unitinfoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.unitinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  // delete unitinfo
  public  unitinfoDeleteClick(): void {
    if (this.unitinfoSelect === undefined || this.unitinfoSelect.length === 0) {
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
        message: `确认要删除这${this.unitinfoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.unitinfoSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select unitinfo
  public  unitinfoonRowSelect(e): void {
    // console.log(e.data);
    this.unitinfoModifay = e.data;
    console.log(this.unitinfoModifay);

  }

}
