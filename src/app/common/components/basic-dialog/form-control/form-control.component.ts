import {Component, Input, OnInit} from '@angular/core';
import {FromData} from '../dialog.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'rbi-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.less']
})
export class FormControlComponent implements OnInit {

  @Input()
  public form: FormGroup;
  @Input()
  public formdata: FromData[];
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
  }

}
