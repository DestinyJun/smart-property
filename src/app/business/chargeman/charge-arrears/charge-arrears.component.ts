import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'rbi-charge-arrears',
  templateUrl: './charge-arrears.component.html',
  styleUrls: ['./charge-arrears.component.less']
})
export class ChargeArrearsComponent implements OnInit {


  @ViewChild('input', {static: true}) input: Input;
  public arrearsTableTitle: any;
  public arrearsTableContent: any;
  public arrearsTableTitleStyle: any;
  public option: any;

  // public arrearsDialogTableTitle = [
  //   {field: 'name', header: '项目名称'},
  //   {field: 'price', header: '标准单价'},
  //   {field: 'month', header: '月数'},
  //   {field: 'discount', header: '折扣'},
  //   {field: 'Chargeable', header: '应收费用'},
  //   {field: 'realCharge', header: '实收费用'},
  //   // {field: 'totle', header: '合计'},
  // ];
  public arrearsSelect: any;
  // public optonDialog = [
  //   {label: '微信', value: '1'},
  //   {label: '支付宝', value: '2'},
  //   {label: '现金', value: '3'},
  //   {label: '刷卡', value: '4'},
  // ];
  // 缴费相关
  // public projectSelectDialog: boolean;
  public arrearsDialog: boolean;
  public arrearsTotle = '￥0';
  // 初始化项目
  // public arrearsProject = [
  //   {name: '物业费', month: '1', hidden: false, check: 1, price: '￥12.5', discount: 7.5, Chargeable: '', realCharge: ''},
  //   {name: '停车费', month: '1', hidden: false, check: 1, price: '￥12.5', discount: 7.5, Chargeable: '', realCharge: ''},
  //   {name: '二次加压费费', month: '', hidden: true, check: 1, price: '￥12.5', discount: 7.5, Chargeable: '', realCharge: ''},
  //   {name: '保证金', month: '', hidden: true, check: 1, price: '￥12.5', discount: 7.5, Chargeable: '', realCharge: ''},
  // ];
  // public arrearsAddTitle = [
  //   {name: '房间代码', value: 'A3-34'},
  //   {name: '建筑面积', value: '123平米'},
  //   {name: '客户名称', value: '张三'},
  //   {name: '手机号码', value: '213490234'},
  //   {name: '物业费到期时间', value: '2019-13-4'},
  // ];
  // public arrearsModifayDialog: boolean;
  // public arrearsModify: any;

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public SearchOption = {
    village: [{label: '未来城', value: '1'}, {label: '云城尚品', value: '2'}],
    region: [{label: 'A3组团', value: '1'}, {label: 'A4组团', value: '2'}, {label: 'A5组团', value: '3'}, {label: 'A6组团', value: '4'}],
    building: [{label: '一栋', value: '1'}, {label: '二栋', value: '2'}, {label: '三栋', value: '3'}, {label: '四栋', value: '4'}],
    unit: [{label: '一单元', value: '1'}, {label: '二单元', value: '2'}, {label: '三单元', value: '3'}, {label: '四单元', value: '4'}],
    room: [{label: '2104', value: '1'}, {label: '2106', value: '2'}, {label: '2107', value: '3'}, {label: '2108', value: '4'}],
  };
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit() {
    this.arrearsInitialization();
  }

  // initialization arrears
  public arrearsInitialization(): void {
    console.log('这里是信息的初始化');
    this.arrearsTableTitle = [
      {field: 'id', header: '序号'},
      {field: 'houseCode', header: '房间号'},
      {field: 'ArrearsProject', header: '欠费项目'},
      {field: 'ArrearsMethod', header: '欠费金额'},
      {field: 'ArrearsTime', header: '欠费时间'},
      {field: 'operating', header: '操作'}
    ];
    this.arrearsTableContent = [
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},
      {id: 1, houseCode: 'A3', ArrearsProject: '物业费', ArrearsMethod: '现金', ArrearsTime: '￥124', paymentTime: '2019-5-5', operating: '详情'},

    ];
    this.option = {total: 15, row: 10, nowpage: 1};
    this.arrearsTableTitleStyle = {background: '#282A31', color: '#DEDEDE', height: '6vh'};
    // console.log(this.arrearsSelect);
  }

  // condition search click
  public arrearsSearchClick(e): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }

  public  arrearsDetailClick(): void {
      this.arrearsDialog = true;
  }
}
