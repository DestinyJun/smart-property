import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AddBuildinginfo, Buildinginfo, ModifyBuildinginfo} from '../../../common/model/bf-buildinginfo.model';
import {BfBuildinginfoService} from '../../../common/services/bf-buildinginfo.service';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'rbi-bf-buildinginfo',
  templateUrl: './bf-buildinginfo.component.html',
  styleUrls: ['./bf-buildinginfo.component.less']
})
export class BfBuildinginfoComponent implements OnInit {
  @ViewChild('input', {static: true}) input: Input;
  public buildinginfoTableTitle: any;
  public buildinginfoTableContent: Buildinginfo[];
  public buildinginfoTableTitleStyle: any;
  public buildinginfoSelect: any;
  // 添加相关
  public buildinginfoAddDialog: boolean;
  public buildinginfoAdd: AddBuildinginfo = new AddBuildinginfo();
  // 修改相关
  public buildinginfoModifayDialog: boolean;
  public buildinginfoModifay: ModifyBuildinginfo = new ModifyBuildinginfo();

  // 其他相关
  public cleanTimer: any; // 清除时钟
  public option: any;
  // public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private buildinginfoService: BfBuildinginfoService,
    private globalService: GlobalService
  ) { }
  ngOnInit() {
    this.buildinginfoInitialization();
  }

  // initialization buildinginfo
  public  buildinginfoInitialization(): void {
    this.buildinginfoService.SearchBuildinfo({}).subscribe(
          (value) => {
            console.log(value);
            this.buildinginfoTableContent = value.data;
            console.log(this.buildinginfoTableContent);
            this.option = {total: 15, row: 10, nowpage: 1};
            // console.log(123);
          }
    );
    console.log('这里是信息的初始化');
    this.buildinginfoTableTitle = [
      {field: 'buildingCode', header: '楼宇编号'},
      {field: 'buildingName', header: '楼宇名称'},
      {field: 'regionId', header: '地块id'},
      {field: 'level', header: '层数'},
      {field: 'using', header: '楼宇类型'},
      {field: 'idt', header: '插入时间'},
      {field: 'udt', header: '修改时间'}
    ];
    // this.buildinginfoTableContent = [
    //   {
    //     buildingCode: 1,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 2,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 3,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 4,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 5,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 6,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 7,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 8,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 9,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 10,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '有'
    //   },
    //   {
    //     buildingCode: 11,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '无'
    //   },
    //   {
    //     buildingCode: 12,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '无'
    //   },
    //   {
    //     buildingCode: 13,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '无'
    //   },
    //   {
    //     buildingCode: 13,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '无'
    //   },
    //   {
    //     buildingCode: 13,
    //     buildingName: '修身苑',
    //     parentCode: 'A23',
    //     buildingPurpose: '住宅',
    //     buildingType: '经济适用住房',
    //     architectureType: '中层楼宇',
    //     buildingQuality: '永久',
    //     elevatorCondition: '无'
    //   },
    // ];
    this.buildinginfoTableTitleStyle = { background: '#282A31', color: '#DEDEDE', height: '6vh'};

  }
  // condition search click
  public  buildinginfoSearchClick(): void {
    // @ts-ignore
    console.log(this.input.nativeElement.value);
    console.log('这里是条件搜索');
  }
  // add  buildinginfo
  public  buildinginfoAddClick(): void {
    this.buildinginfoAddDialog = true;
    console.log('这里是添加信息');
  }
  // sure add buildinginfo
  public  buildinginfoAddSureClick(): void {
    this.confirmationService.confirm({
      message: `确认要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.buildinginfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是增加信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // modify buildinginfo
  public buildinginfoModifyClick(): void {
    console.log(this.buildinginfoSelect);
    if (this.buildinginfoSelect === undefined || this.buildinginfoSelect.length === 0 ) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.messageService.clear();
      this.messageService.add({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.messageService.clear();
      }, 3000);
    } else if (this.buildinginfoSelect.length === 1) {
      this.buildinginfoModifayDialog = true;
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
  // sure modify buildinginfo
  public  buildinginfoModifySureClick(): void {
    this.confirmationService.confirm({
      message: `确认要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.buildinginfoSelect);

        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        console.log('这里是修改信息');

        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }
  // delete buildinginfo
  public  buildinginfoDeleteClick(): void {
    if (this.buildinginfoSelect === undefined || this.buildinginfoSelect.length === 0) {
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
        message: `确认要删除这${this.buildinginfoSelect.length}项吗`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(this.buildinginfoSelect);

          // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
        },
        reject: () => {
          console.log('这里是删除信息');

          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
      });
    }
  }
  // select buildinginfo
  public  buildinginfoonRowSelect(e): void {
    // console.log(e.data);
    this.buildinginfoModifay = e.data;
    console.log(this.buildinginfoModifay);

  }
}
