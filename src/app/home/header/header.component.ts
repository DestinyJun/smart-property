import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HomeService} from '../../common/services/home.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {ConfirmationService} from 'primeng/api';
import {LoginoutService} from '../../common/services/loginout.service';
import {HeaderService} from '../../common/services/header.service';

@Component({
  selector: 'rbi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild('headerbar') public headerbar: Element;
  @ViewChild('titlebar') public titlebar: Element;
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
    private headerSrv: HeaderService
  ) {
  }

  ngOnInit() {
    this.headerSrv.getUserInfo().subscribe(
      value => {
        if (value.status === '1000') {
          this.username = value.data.username;
        }
      }
    );
    this.localSrv.getObject('item').forEach( v => {
      this.items.forEach( data => {
        if (v.title === data.title) {
          this.item.push(data);
          // this.item = this.items;
        }
      });
    });
    // console.log(this.sidBarItem);
    this.url = this.location.path().split('/', 3)[2];
    this.UrlActivateStatus(this.url);
    // 定略获取路由
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          // console.log(event);
          this.url = event.url.split('/', 3)[2];
          this.UrlActivateStatus(this.url);
          /* titleSrv.setTitle(title[event.urlAfterRedirects]);*/
        }
      }
    );
    // console.log(this.abc);
    this.clickStuts = false;
    this.barHidden = false;
  }

  // 关闭导航
  public closesidBarClick(e): void {
    if (this.routeinfo.snapshot.children[0].url[0].path === 'main') {
      e.path[1].style.marginLeft = '8vw';
      e.path[1].style.borderLeft = '3vh solid transparent';
    } else {
      if (this.clickStuts) {
        e.path[1].style.marginLeft = '8vw';
        e.path[1].style.borderLeft = '3vh solid transparent';
        this.clickStuts = false;
        this.barHidden = false;
        this.mainMaginLeft = 9;
      } else {
        e.path[1].style.marginLeft = '0vw';
        e.path[1].style.borderLeft = '0 solid transparent';
        this.clickStuts = true;
        this.barHidden = true;
        this.mainMaginLeft = 0.5;
      }
      this.hiddenSidBar.emit(this.barHidden);
      this.mainStyle.emit(this.mainMaginLeft);
    }

  }
  // 头部导航点击事件
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
    // 点击导航  title变回来
    // @ts-ignore
    this.mainMaginLeft = 9;
    this.sidbarSetData(e.target.innerHTML);
    this.mainStyle.emit(this.mainMaginLeft);
    this.hiddenSidBar.emit(this.barHidden);
    e.path[0].style.color = '#3A7ADF';
  }
  // 查看路由激活
  public UrlActivateStatus(url): void {
    // console.log(url);
    // const setTime = setInterval( () => {
    //   if (this.item.length > 0) {
    //   }
    // }, 500);
    this.item.map((prop) => {
      if (prop.router.split('/', 3)[2].indexOf(url) === 0) {
        prop.color = '#3A7ADF';
        this.sidbarSetData(prop.title);
        // clearInterval(setTime);
      }
    });

  }

  // 设置侧边导航数据
  public sidbarSetData(data): void {
    this.sidBarData.emit(data);
  }
  // login out
  public  loginOutClick(): void {
    this.confirmationService.confirm({
      message: `确认要退出登录吗？`,
      header: '退出提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loginOutSrv.logout({}).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '1000') {
              this.localSrv.remove('appkey');
              this.router.navigate(['/login']);
            } else {
              window.alert(value.message);
            }
          }
        );
        // this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
      }
    });
  }

}
