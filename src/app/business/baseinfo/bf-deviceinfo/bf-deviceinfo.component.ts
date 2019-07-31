import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BfDevinceinfoService} from '../../../common/services/bf-devinceinfo.service';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'rbi-bf-deviceinfo',
  templateUrl: './bf-deviceinfo.component.html',
  styleUrls: ['./bf-deviceinfo.component.less']
})
export class BfDeviceinfoComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public deviceinfoTableTitle: any;
  public deviceinfoTableContent: any;
  public deviceinfoTableTitleStyle: any;
  public deviceinfoSelect: any;
  // 添加相关
  public deviceinfoAddDialog: boolean;
  public deviceinfoAdd: any;
  // 修改相关
  public deviceinfoModifayDialog: boolean;
  public deviceinfoModifay: any;

  // 其他相关
  public cleanTimer: any; // 清除时钟
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit() {
    this.deviceinfoInitialization();
  }

  // initialization deviceinfo
  public  deviceinfoInitialization(): void {
    console.log('这里是信息的初始化');
    this.deviceinfoTableTitle = [
      {field: 'eventId', header: '事件编号'},
      {field: 'eventName', header: '事件名称'},
      {field: 'eventContent', header: '事件内容'},
      {field: 'eventType', header: '事件类型'},
      {field: 'eventOperator', header: '操作人'},
      {field: 'eventDate', header: '插入时间'}
    ];
    this.deviceinfoTableContent = [
      {eventId: 1, eventName: '楼道卫生', eventContent: '卫生不干净', eventType: '报警', eventOperator: '吴小雨', eventDate: '2019-5-5'},
      {eventId: 2, eventName: '公共财物', eventContent: '门铃损坏', eventType: '报警', eventOperator: '吴小雨', eventDate: '2019-5-5'},
      {eventId: 3, eventName: '公共财物', eventContent: '卫生不干净', eventType: '报警', eventOperator: '吴小雨', eventDate: '2019-5-5'},
      {eventId: 4, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '吴小雨', eventDate: '2019-5-5'},
      {eventId: 5, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '吴小雨', eventDate: '2019-5-5'},
      {eventId: 6, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 7, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 8, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 9, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 10, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 12, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 13, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 14, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
      {eventId: 15, eventName: '异常事件', eventContent: '报警内容', eventType: '报警', eventOperator: '张山', eventDate: '2019-5-5'},
    ];
    this.deviceinfoTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.deviceinfoSelect);

  }
  // condition search click
  public  deviceinfoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  deviceinfo
  public  deviceinfoAddClick(): void {
    this.deviceinfoAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add deviceinfo
  public  deviceinfoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.deviceinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify deviceinfo
  public deviceinfoModifyClick(): void {
    console.log(this.deviceinfoSelect);
    if (this.deviceinfoSelect === undefined || this.deviceinfoSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.deviceinfoSelect.length === 1) {
      this.deviceinfoModifayDialog = true;
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
  // sure modify deviceinfo
  public  deviceinfoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.deviceinfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete deviceinfo
  public  deviceinfoDeleteClick(): void {
    if (this.deviceinfoSelect === undefined || this.deviceinfoSelect.length === 0) {
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
        message: `确认要删除这${this.deviceinfoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.deviceinfoSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select deviceinfo
  public  deviceinfoonRowSelect(e): void {
    // console.log(e.data);
    this.deviceinfoModifay = e.data;
    console.log(this.deviceinfoModifay);

  }
}
