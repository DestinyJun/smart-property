import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TableOption} from '../table.model';

@Component({
  selector: 'rbi-check-table-btn',
  templateUrl: './check-table-btn.component.html',
  styleUrls: ['./check-table-btn.component.less']
})
export class CheckTableBtnComponent implements OnInit, OnChanges {
  @Input()
  public option: TableOption;
  @Output()
  public detail = new EventEmitter<number>();
  @Output()
  public selectData =  new EventEmitter<number>();
  @Input()
  public select: any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.option) {
      console.log(this.option);
    }
  }
  public  DetailClick(e): void {
      this.detail.emit(e);
  }
  // select Data
  public  selectClick(e): void {
      this.selectData.emit(this.select);
  }
  // cancel select data
  public  noSelectClick(e): void {
      this.selectData.emit(this.select);
  }

}
