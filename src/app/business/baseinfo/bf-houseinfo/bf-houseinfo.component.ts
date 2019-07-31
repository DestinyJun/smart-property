import {Component, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Unitinfo} from '../../../common/model/bf-unitinfo.model';
import {AddHouseinfo, Houseinfo, ModifyHouseinfo} from '../../../common/model/bf-houseinfo.model';
import {BfHouseinfoService} from '../../../common/services/bf-houseinfo.service';

@Component({
  selector: 'rbi-bf-houseinfo',
  templateUrl: './bf-houseinfo.component.html',
  styleUrls: ['./bf-houseinfo.component.less']
})
export class BfHouseinfoComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public houseinfoTableTitle: any;
  public houseinfoTableContent: Houseinfo[];
  public houseinfoTableTitleStyle: any;
  public houseinfoSelect: any;
  // 添加相关
  public houseinfoAddDialog: boolean;
  public houseinfoAdd: AddHouseinfo = new AddHouseinfo();
  // 修改相关
  public houseinfoModifayDialog: boolean;
  public houseinfoModifay: ModifyHouseinfo = new ModifyHouseinfo();

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any; // 清除时钟
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private houseinfoService: BfHouseinfoService,
  ) { }
  ngOnInit() {
    this.houseinfoInitialization();
  }

  // initialization houseinfo
  public  houseinfoInitialization(): void {
    console.log('这里是信息的初始化');
    this.houseinfoTableTitle = [
      {field: 'roomCode', header: '房间编号'},
      {field: 'unitCode', header: '单元编号'},
      {field: 'roomSize', header: '住房大小'},
      {field: 'roomType', header: '房间类型'},
      {field: 'roomStatus', header: '房间状态'},
      {field: 'contractDeadline', header: '合同收房日'},
      {field: 'renovationStatus', header: '装修情况'},
      {field: 'unitId', header: '单元ID'},
      {field: 'idt', header: '插入时间'},
      {field: 'udt', header: '修改时间'},
    ];
    this.houseinfoService.SearchHouseinfo({}).subscribe(
      (value) => {
        console.log(value);
        this.houseinfoTableContent = value.data;
        this.option = {total: 15, row: 10, nowpage: 1};
      }
    );
    this.houseinfoTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.houseinfoSelect);

  }
  // condition search click
  public  houseinfoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  houseinfo
  public  houseinfoAddClick(): void {
    this.houseinfoAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add houseinfo
  public  houseinfoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.houseinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify houseinfo
  public houseinfoModifyClick(): void {
    console.log(this.houseinfoSelect);
    if (this.houseinfoSelect === undefined || this.houseinfoSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.houseinfoSelect.length === 1) {
      this.houseinfoModifayDialog = true;
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
  // sure modify houseinfo
  public  houseinfoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.houseinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete houseinfo
  public  houseinfoDeleteClick(): void {
    if (this.houseinfoSelect === undefined || this.houseinfoSelect.length === 0) {
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
        message: `确认要删除这${this.houseinfoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.houseinfoSelect);

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
  public  houseinfoonRowSelect(e): void {
    // console.log(e.data);
    this.houseinfoModifay = e.data;
    console.log(this.houseinfoModifay);

  }
}
