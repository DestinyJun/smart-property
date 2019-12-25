import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {TreeNode} from '../../common/model/shared-model';
import {DataTree} from '../../common/components/basic-dialog/dialog.model';
import {GlobalService} from '../../common/services/global.service';
import {SharedServiceService} from '../../common/public/shared-service.service';
import {ThemeService} from '../../common/public/theme.service';
import {PublicMethedService} from '../../common/public/public-methed.service';
import {Subscription} from 'rxjs';
import {UpdateTreeService} from '../../common/public/update-tree.service';

@Component({
  selector: 'rbi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  @ViewChild('mainStyle') mainStyle: Element;
  public sidbarHidden: boolean;
  public sidbarItem: any;
  public treeDialog = false;
  public roomtree: any;
  public themeFlag = 0;
  // public themeTitle = '经典黑';
  // public themeColor = '#282A31';
  public themeList = [
    {label: '自然绿', value: '#55AA80'},
    {label: '天空蓝', value: '#7EC6F5'},
    {label: '简约粉', value: '#DEA8A8'},
    {label: '深沉棕', value: '#CF8D73'},
    {label: '经典黑', value: '#282A31'},
  ];
  public imageHidden = false;

  public SearchData = {
    villageCode: '',
    regionCode: '',
    buildingCode: '',
    unitCode: '',
    roomCode: '',
    data: {
      level: '',
      code: '',
    }
  };

  public dataTrees: DataTree[];
  public dataTree: DataTree = new DataTree();
  // 服务传参相关
  public updateSub: Subscription;
  constructor(
    private homeSrv: HomeService,
    private route: ActivatedRoute,
    private localSrv: LocalStorageService,
    private globalSrv: GlobalService,
    private shareSrv: SharedServiceService,
    private toolSrv: PublicMethedService,
    private updateTreeSrv: UpdateTreeService,
  ) {
    this.updateSub = this.updateTreeSrv.changeEmitted$.subscribe(
      value => {
        // if(value ==)
        console.log(value);
        this.getTreeData();
      }
    );
  }

  ngOnInit() {
    if (this.localSrv.getObject('theme').value) {
      this.toolSrv.changeTheme(this.localSrv.getObject('theme').value);
      this.themeFlag = this.localSrv.getObject('theme').flag;
    } else {
      this.toolSrv.changeTheme('green');
    }
    if (this.route.snapshot.children[0].url[0].path === 'main') {
      this.sidbarHidden = true;
    }
   this.getTreeData();
  }
  // sidebar Hidden display
  public homeHiddenSidebar(e): void {
    this.sidbarHidden = e;
    // this.imageHidden = false;
  }

  // sidebar data
  public homeSetsidebarData(e): void {
    this.sidbarItem = e;
  }
  // Set main style
  public  homeSetMainStyle(e): void {
    // @ts-ignore
    this.mainStyle.nativeElement.style.marginLeft = e + 'vw';
  }

  public initializeTree(data): any {
    // console.log(oneChild);
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.value = data[i].code;
      childnode.label = data[i].name;
      childnode.level = data[i].level;
      if (data[i].villageChoose2DTO != null && data[i].villageChoose2DTO.length !== 0 ) {
        childnode.children = this.initializeTree(data[i].villageChoose2DTO);
      } else {
        childnode.children = [];
      }
      oneChild.push(childnode);
    }
    return oneChild;
  }

  // Tree structure is not selected
  public  treeOnNodeSelect(e): void {
    // tslint:disable-next-line:forin
    for (const key in this.SearchData) {
      if (key !== 'data') {
        this.SearchData[key] = '';
      } else {
        this.SearchData[key].level = '';
        this.SearchData[key].code = '';
      }
    }

    this.SearchData.data.level = e.node.level;
    this.SearchData.data.code = e.node.value;
    this.setSearhData(e.node);
    this.shareSrv.emitChange(this.SearchData);
  }

  public  setSearhData(data): any {
    switch (data.level) {
      case '1': this.SearchData.villageCode = data.value; break;
      case '2': this.SearchData.regionCode = data.value; break;
      case '3': this.SearchData.buildingCode = data.value; break;
      case '4': this.SearchData.unitCode = data.value; break;
      case '5': this.SearchData.roomCode = data.value; break;
      default: break;
    }
    if (data.parent !== undefined) {
      this.setSearhData(data.parent);
    }
  }

  public mouserEnter(): void {
      this.treeDialog = true;
  }
  // public  dataTreeSureClick(): void {
  //
  // }

  public  changeTheme(): void {
    switch (this.themeFlag) {
      case 0:
        this.themeFlag += 1;
        this.localSrv.setObject('theme', {value: 'blue', flag: this.themeFlag});
        this.toolSrv.changeTheme('blue');
        this.setChangeTheme('blue');
        break;
      case 1:
        this.themeFlag += 1;
        this.localSrv.setObject('theme', {value: 'pink', flag: this.themeFlag});
        this.toolSrv.changeTheme('pink');
        this.setChangeTheme('pink');
        break;
      case 2:
        this.themeFlag  += 1;
        this.localSrv.setObject('theme', {value: 'brown', flag: this.themeFlag});
        this.toolSrv.changeTheme('brown');
        this.setChangeTheme('brown');
        break;
      case 3:
        this.themeFlag  += 1;
        this.localSrv.setObject('theme', {value: 'default', flag: this.themeFlag});
        this.toolSrv.changeTheme('default');
        this.setChangeTheme('default');
        break;
      case 4:
        this.themeFlag = 0;
        this.localSrv.setObject('theme', {value: 'green', flag: this.themeFlag});
        this.toolSrv.changeTheme('green');
        this.setChangeTheme('green');
        break;
    }
  }
  public  setChangeTheme(data): void {
      this.homeSrv.setChangeTheme({theme: data}).subscribe(
        value => {
          console.log(value);
            if (value.status === '1000') {
              this.toolSrv.setToast('success', '绑定成功', '主题绑定用户成功');
            } else {
              this.toolSrv.setToast('error', '绑定失败', '主题该主题仅限于当次使用');
            }
        }
      );
  }

  public  getTreeData(): void {
    this.globalSrv.queryTVillageTree().subscribe(
      value => {
        if (value.status === '1000') {
          this.roomtree = value.data;
          this.dataTrees = this.initializeTree(this.roomtree);
        }
      }
    );
  }
}
