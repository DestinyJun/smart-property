import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'rbi-bf-table',
  templateUrl: './bf-table.component.html',
  styleUrls: ['./bf-table.component.less']
})
export class BfTableComponent implements OnInit {
  @Input()
  public option: {
    tableHeader: any;
    tableContent: any;
  };
  constructor() { }

  ngOnInit() {
  }

}
