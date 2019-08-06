import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DialogModel} from '../dialog.model';

@Component({
  selector: 'rbi-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.less']
})
export class BasicDialogComponent implements OnInit, OnChanges {

  public dialog: boolean;
  @Input()
  public dialogOption: DialogModel = new DialogModel();
  @Input()
  public dialogData: any;
  @Output()
  public event = new EventEmitter<number>();
  public esDate = {
    firstDayOfWeek: 0,
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    clear: '清除'
  };
  constructor() { }

  ngOnInit() {
    this.dialog = false;
  }
  public  SureClick(e): void {
    this.dialog = false;
    console.log(e);
    this.event.emit(this.dialogData);
  }
  public  CloseClick(e): void {
    this.dialog = false;
    console.log(e);
    this.event.emit(this.dialogData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dialogOption) {
      this.dialog = true;
    }
    console.log(this.dialogData);
  }

}
