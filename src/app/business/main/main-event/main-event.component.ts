import {Component, OnInit, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'rbi-main-event',
  templateUrl: './main-event.component.html',
  styleUrls: ['./main-event.component.less'],
})
export class MainEventComponent implements OnInit {

  public cols: any;
  public eventdata: any;
  public styleHeader: any;
  public option: any;
  constructor() {

  }

  ngOnInit() {
    this.option = {
      tableHeader:  this.cols = [
        {field: 'eventId', header: '事件编号'},
        {field: 'eventName', header: '事件名称'},
        {field: 'eventContent', header: '事件内容'},
        {field: 'eventType', header: '事件类型'},
        {field: 'eventOperator', header: '操作人'},
        {field: 'eventDate', header: '插入时间'}
      ],
      tableContent:  this.eventdata = [
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
        ],
    };
    this.styleHeader = { background: '#33353C', color: '#DEDEDE', height: '6vh'};
  }
}
