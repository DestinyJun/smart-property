import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DialogModel, FormValue, FromData} from '../dialog.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'rbi-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.less']
})
export class BasicDialogComponent implements OnInit, OnChanges {

  public dialog: boolean;
  @Input()
  public dialogOption: DialogModel = new DialogModel();
  @Output()
  public eventClick = new EventEmitter<number>();
  @Input()
  public form: FormValue[];
  @Input()
  public formdata: FromData[];
  @Input()
  public formValue: FormValue[];
  public formContrl: FormGroup;
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
  public  SureClick(): void {
    this.dialog = false;
    this.eventClick.emit(this.formContrl.value);
    console.log(this.formContrl.value);
  }
  public  CloseClick(): void {
    this.dialog = false;
    // this.eventClick.emit(this.formContrl.value);
    // console.log(this.formContrl.value);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dialogOption) {
      this.dialog = true;
      this.formContrl = this.setFormGroup(this.form);
    }
  }

  public  setFormGroup(data): any {
    const group: any = {};
    data.forEach( val => {
      if (val.disabled) {
        group[val.key] = new FormControl({value: val.value || '', disabled: true});
      } else {
        group[val.key] = new FormControl({value: val.value || '', disabled: false});
      }
      if (val.required) {
        group[val.key].validator = Validators.required;
      }
    });
    return new FormGroup(group);
  }
}
