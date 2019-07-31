import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {ConfirmationService} from 'primeng/api';
import {LoginoutService} from '../../common/services/loginout.service';
import {HeaderService} from '../../common/services/header.service';
import {PublicMethedService} from '../../common/public/public-methed.service';

@Component({
  selector: 'rbi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild('headerbar', {static: true}) public headerbar: Element;
  @ViewChild('titlebar', {static: true}) public titlebar: Element;
  @Output('hiddenSidBar')
  public hiddenSidBar = new EventEmitter();
  @Output('sidBarData')
  public sidBarData = new EventEmitter();
  @Output('mainStyle')
  public mainStyle = new EventEmitter();
  public mainMaginLeft: any;
  public barHidden: boolean;
  public clickStuts: boolean;
  public url: any = null;
  public username: any;
  public item: any[] = [];
  public items = [
    {router: '/home/main', title: '首页', color: '#fff'},
    {router: '/home/baseinfo/owner', title: '基础信息', color: '#fff'},
    // {router: '/home/assoc/assocstaff', title: '关联设置', color: '#fff'},
    {router: '/home/charge/payment', title: '收费管理', color: '#fff'},
    // {router: '/home/monitor/log', title: '运行事件监视', color: '#fff'},
    // {router: '/home/chat', title: '在线客服', color: '#fff'},
    {router: '/home/coupon/total', title: '优惠券', color: '#fff'},
    {router: '/home/refund/info', title: '退款', color: '#fff'},
    {router: '/home/system/config', title: '系统设置', color: '#fff'},
  ];

  constructor(
    private homeSrv: HomeService,
    private routeinfo: ActivatedRoute,
    private router: Router,
    private location: Location,
    private localSrv: LocalStorageService,
    private confirmationService: ConfirmationService,
    private loginOutSrv: LoginoutService,
    private headerSrv: HeaderService,
    private toolSrv: PublicMethedService
  ) {
  }

  ngOnInit() {
    this.item = [];
    this.headerSrv.getUserInfo().subscribe(
      value => {

        if (value.status === '1000') {
          this.username = value.data.username;
        }
      }
    );
    this.localSrv.getObject('item').forEach(v => {
      this.items.forEach(data => {
        if (v.title === data.title) {
          this.item.push(data);
        }
      });
    });
    this.url = this.location.path().split('/', 3)[2];
    this.UrlActivateStatus(this.url);
    // Slightly get the route
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          // console.log(event);
          this.url = event.url.split('/', 3)[2];
          this.UrlActivateStatus(this.url);
        }
      }
    );
    this.clickStuts = false;
    this.barHidden = false;
  }
  // Head navigation click event
  public spanBarClick(e, index): void {
    this.router.navigate([this.item[index].router]);
    // @ts-ignore
    for (let i = 0; i < this.headerbar.nativeElement.children.length; i++) {
      // @ts-ignore
      this.headerbar.nativeElement.children[i].style.color = '#fff';
    }
    if (e.target.innerHTML === '首页' || e.target.innerHTML === '在线客服') {
      this.barHidden = true;
      // @ts-ignore
      this.titlebar.nativeElement.style.marginLeft = '8vw';
      // @ts-ignore
      this.titlebar.nativeElement.style.borderLeft = '3vh solid transparent';
      this.clickStuts = false;
    } else {
      // @ts-ignore
      this.titlebar.nativeElement.style.marginLeft = '8vw';
      // @ts-ignore
      this.titlebar.nativeElement.style.borderLeft = '3vh solid transparent';
      this.clickStuts = false;
      this.barHidden = false;
    }
    this.mainMaginLeft = 9;
    this.sidbarSetData(e.target.innerHTML);
    this.mainStyle.emit(this.mainMaginLeft);
    this.hiddenSidBar.emit(this.barHidden);
    e.path[0].style.color = '#3A7ADF';
  }

  // View route activation
  public UrlActivateStatus(url): void {
    // console.log(url);
    this.item.map((prop) => {
      if (prop.router.split('/', 3)[2].indexOf(url) === 0) {
        prop.color = '#3A7ADF';
        this.sidbarSetData(prop.title);
      }
    });
  }

  // emit sidebar navigation data
  public sidbarSetData(data): void {
    this.sidBarData.emit(data);
  }
  // sign out
  public  loginOutClick(): void {
    console.log(123);
    this.toolSrv.setConfirmation('退出', '退出登录', () => {
      this.loginOutSrv.logout({}).subscribe(
        (value) => {
          console.log(value);
          if (value.status === '1000') {
            this.localSrv.remove('appkey');
            this.localSrv.remove('item');
            this.router.navigate(['/login']);
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
    });
  }

}
