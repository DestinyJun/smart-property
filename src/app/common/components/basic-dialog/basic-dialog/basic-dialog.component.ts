import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rbi-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.less']
})
export class BasicDialogComponent implements OnInit {

  public dialog: boolean;
  constructor() { }

  ngOnInit() {
  }
  public  SureClick(e): void {
    console.log(e);
  }
  public  CloseClick(e): void {
    console.log(e);
  }

}
