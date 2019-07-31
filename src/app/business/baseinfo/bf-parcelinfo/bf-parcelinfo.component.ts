import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService,  MessageService} from 'primeng/api';
import {AddBfParcelinfo, BfParcelinfo, ModifyBfParcelinfo} from '../../../common/model/bf-parcelinfo.model';
import {BfParcelinfoService} from '../../../common/services/bf-parcelinfo.service';

@Component({
  selector: 'rbi-bf-parcelinfo',
  templateUrl: './bf-parcelinfo.component.html',
  styleUrls: ['./bf-parcelinfo.component.less']
})
export class BfParcelinfoComponent implements OnInit {
  @ViewChild('input', {static: true}) input: Input;
  public parcelinfoTableTitle: any;
  public parcelinfoTableContent: BfParcelinfo[];
  public parcelinfoTableTitleStyle: any;
  public parcelinfoSelect: any;
  // 添加相关
  public parcelinfoAddDialog: boolean;
  public parcelinfoAdd: AddBfParcelinfo = new AddBfParcelinfo();
  // 修改相关
  public parcelinfoModifayDialog: boolean;
  public parcelinfoModifay: ModifyBfParcelinfo = new ModifyBfParcelinfo();

  // 其他相关
  public option: any;
  public cleanTimer: any; // 清除时钟
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private parcelinfoService: BfParcelinfoService,
  ) { }
  ngOnInit() {
    this.parcelinfoInitialization();
  }

  // initialization parcelinfo
  public  parcelinfoInitialization(): void {
    this.parcelinfoTableTitle = [
      {field: 'regionCode', header: '地块编号'},
      {field: 'regionName', header: '地块名称'},
      {field: 'constructionArea', header: '地块建筑面积'},
      {field: 'greeningRate', header: '绿化率'},
      {field: 'publicArea', header: '公共场所面积'},
      {field: 'villageName', header: '小区名字'},
      // {field: 'idt', header: '插入时间'},
      // {field: 'udt', header: '更新时间'},
    ];
    this.parcelinfoService.SearchParcelInfo({}).subscribe(
      (value) => {
        console.log(value);
        this.parcelinfoTableContent = value.data;
        this.option = {total: 15, row: 10, nowpage: 1};
      }
    );
    this.parcelinfoTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};
    console.log(this.parcelinfoSelect);

  }
  // condition search click
  public  parcelinfoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add parcelinfo
  public  parcelinfoAddClick(): void {
    this.parcelinfoAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add parcelinfo
  public  parcelinfoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.parcelinfoAdd);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify parcelinfo
  public  parcelinfoModifyClick(): void {
   console.log(this.parcelinfoSelect);
   if (this.parcelinfoSelect === undefined || this.parcelinfoSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.parcelinfoSelect.length === 1) {
      this.parcelinfoModifayDialog = true;
      console.log('这里是修改信息');
    } else {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '只能选择一项进行修改'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    }
  }
  // sure modify parcelinfo
  public  parcelinfoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.parcelinfoModifay);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  // delete parcelinfo
  public  parcelinfoDeleteClick(): void {
    if (this.parcelinfoSelect === undefined || this.parcelinfoSelect.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确认要删除这${this.parcelinfoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.parcelinfoSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select parcelinfo
  public  parcelinfoonRowSelect(e): void {
      console.log(this.parcelinfoSelect);
      this.parcelinfoModifay = e.data;
      console.log(this.parcelinfoModifay);

  }
}
