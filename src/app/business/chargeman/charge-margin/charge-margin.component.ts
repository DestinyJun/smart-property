import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'rbi-charge-margin',
  templateUrl: './charge-margin.component.html',
  styleUrls: ['./charge-margin.component.less']
})
export class ChargeMarginComponent implements OnInit {

  @ViewChild('input', {static: true}) input: Input;
  public marginTableTitle: any;
  public marginTableContent: any;
  public marginTableTitleStyle: any;
  public marginSelect: any;
  public optionType = [
    {label: '银行卡' , value: '1'},
    {label: '转物业费' , value: '2'},
  ];
  // 退款相关
  // public projectSelectDialog: boolean;
  public marginRefundDialog: boolean;
  public marginDetailDialog: boolean;
  // public marginTotle = '￥0';
  // 初始化项目
  // public marginModifayDialog: boolean;
  // public marginModify: any;
  public SearchOption = {
    village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
    region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
    building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
    unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
    room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  }
  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit() {
    this.marginInitialization();
  }
  // table set data
  // public  marginTableSetClick(): void {
  //   this.marginDialog = true;
  //   // console.log();
  // }
  //
  // public  marginChange(i): void {
  //
  //   console.log(i);
  //   if (this.tableSet[i].check === 0 ) {
  //     this.tableSet[i].check = 1;
  //   } else {
  //     this.tableSet[i].check = 0;
  //   }
  //   console.log(this.tableSet);
  // }
  // download table data
  // public  marginRefundClick(e): void {
  //   if (this.marginSelect.length === undefined || this.marginSelect.length === 0) {
  //       if (this.cleanTimer) {
  //         clearTimeout(this.cleanTimer);
  //       }
  //       this.messageService.clear();
  //       this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要退款的项'});
  //       this.cleanTimer = setTimeout(() => {
  //         this.messageService.clear();
  //       }, 3000);
  //   } else if (this.marginSelect.length === 1) {
  //     this.marginDialog = true;
  //     console.log(123);
  //   } else {
  //     if (this.cleanTimer) {
  //       clearTimeout(this.cleanTimer);
  //     }
  //     this.messageService.clear();
  //     this.messageService.add({severity: 'error', summary: '操作错误', detail: '只能选择一项进行退款'});
  //     this.cleanTimer = setTimeout(() => {
  //       this.messageService.clear();
  //     }, 3000);
  //   }
  // }
  // initialization margin
  public  marginInitialization(): void {
    console.log('这里是信息的初始化');
    this.marginTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'houseCode', header: '房间号'},
      {field: 'owner', header: '缴费人'},
      {field: 'paymentMethod', header: '支付方式'},
      {field: 'paymentAmount', header: '缴费金额'},
      {field: 'paymentTime', header: '缴费时间'},
      {field: 'operating', header: '操作'}
    ];
    this.marginTableContent = [
      {id: 1, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 2, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 4, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 5, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 6, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 7, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 8, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 9, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 10, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 11, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
      {id: 12, houseCode: 'A3', owner: '张三', paymentMethod: '现金', paymentAmount: '￥124', paymentTime: '2019-5-5' , operating: '详情'},
    ];
    this.option = {total: 15, row: 10, nowpage: 1};
    this.marginTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.marginSelect);
  }
  // condition search click
  public  marginSearchClick(e): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // sure modify margin
  public  marginSureClick(): void {
    // this.confirmationService.confirm({
    //   message: `是否打印单据吗？`,
    //   header: '打印提醒',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     console.log(this.marginSelect);
    //
    //     // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
    //   },
    //   reject: () => {
    //     console.log('这里是修改信息');
    //
    //     // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
    //   }
    // });
    // console.log();
  }
  // false modify margin
  public  marginFaleseClick(): void {
    this.marginRefundDialog = false;
  }

  // seeing detail
  public  marginDetailClick(): void {
      this.marginDetailDialog = true;
  }
  //
  public  marginRefundClick(): void {
      this.marginRefundDialog = true;
  }
}
