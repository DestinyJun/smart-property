import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DialogModel} from '../dialog.model';
import {FormGroup} from '@angular/forms';

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
  // @Input()
  // public form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.dialog = false;
  }
  public  SureClick(e): void {
    this.dialog = false;
    this.eventClick.emit(e);
  }
  public  CloseClick(e): void {
    this.dialog = false;
    this.eventClick.emit(e);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dialogOption) {
      this.dialog = true;
    }
  }

}
