import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DataTree, DialogModel, FormValue, FromData} from '../dialog.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TreeNode} from '../../../model/shared-model';

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
  public eventClick = new EventEmitter<any>();
  @Output()
  public blurClick = new EventEmitter<any>();
  @Input()
  public formContrl: FormGroup;
  @Input()
  public formdata: FromData[];
  public dataTrees: DataTree[];
  public dataTree: DataTree = new DataTree();
  public treeDialog: boolean;
  public flag = 0;
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
  // dialog sure
  public  SureClick(): void {
    console.log(this.formContrl);
    this.dialog = false;
    console.log(this.formContrl);
    this.eventClick.emit(this.formContrl);

  }
  // dialg window closed
  public  CloseClick(): void {
    this.dialog = false;
  }
  public  dataTreeClick(name, datatree): void {
    this.dataTrees = this.initializeTree(datatree);
    this.treeDialog = true;
  }
  // 不选择
  public  treeOnNodeSelect(e): void {
      console.log(e);
  }
  // Confirm selected data
  public  dataTreeSureClick(): void {
    this.setData(this.dataTree);
    this.treeDialog = false;
  }
  //
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.dialogOption) {
      this.dialog = true;
      // console.log(this.form);
      console.log(this.formContrl);
      // this.formContrl = this.form;
    // }
  }


  // Tree structure initialization
  public initializeTree(data): any {
    // console.log(oneChild);
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].code;
      childnode.label = data[i].name;
      if (data[i].villageChoose2DTO != null && data[i].villageChoose2DTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].villageChoose2DTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }

  // Set the value in the acquired tree
  public setData(data): void {
    this.flag = this.flag + 1;
    switch (this.flag) {
      case 1:
        this.formContrl.patchValue({roomCode: data.value});
        break;
      case 2:
        this.formContrl.patchValue({unitCode: data.value, unitName: data.label});
        break;
      case 3:
        this.formContrl.patchValue({buildingCode: data.value, buildingName: data.label});
        break;
      case 4:
        this.formContrl.patchValue({regionCode: data.value, regionName: data.label});
        break;
      case 5:
        this.formContrl.patchValue({villageCode: data.value, villageName: data.label});
        break;
    }
    if (this.flag !== 5) {
      if (data.parent) {
        this.setData(data.parent);
      }
    }
  }
  public  inputBlur(e): void {
      const data = {name: e , value: this.formContrl};
      this.blurClick.emit(data);
  }
  public  dataChange(e, value, option): void {
    console.log(value);
    let a = {};
    option.forEach(v => {
      if (this.formContrl.value[e] === v.value) {
        a[value] = v.label;
        this.formContrl.patchValue(a);
      }
    });
    console.log(this.formContrl);
    const data = {name: e , value: this.formContrl};
    this.blurClick.emit(data);
  }
}
