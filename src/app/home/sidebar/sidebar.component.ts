import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {PanelMenu} from 'primeng/primeng';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {HomeService} from '../../common/services/home.service';
import {PublicMethedService} from '../../common/public/public-methed.service';
@Component({
  selector: 'rbi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit , OnChanges, AfterViewInit {
  @Input()public data: any;
  public items: MenuItem[] = [];
  public slidinghight: number;
  public slidingTop: number;
  public url: any = null;
  public sidebarItem = [];
  public ItemData = [];
  public flag: boolean;
  public cleanTimer: any; // 清除时钟
  // public items: MenuItem[];
  constructor(
    private router: Router,
    private location: Location,
    private localSrv: LocalStorageService,
    private homeSrv: HomeService,
    private messageService: MessageService,
    private toolSrv: PublicMethedService,

  ) {
  }

  ngOnInit() {
    // if (this.localSrv.getObject('sidebarItem') === '' || this.localSrv.getObject('sidebarItem') === null ) {
    //   this.ItemData = this.toolSrv.ItemData;
    //   this.localSrv.getObject('item').forEach(v => {
    //     this.ItemData.forEach( h => {
    //       if (v.title === h.title) {
    //         this.items = [];
    //         this.homeSrv.getChildrenRouter({parentCode: v.permisCode}).subscribe(
    //           (value) => {
    //             value.data.forEach( data => {
    //               h.routingItem.forEach( val => {
    //                 if (val.label === data.title) {
    //                   this.sidebarItem.push({parentCode: data.parentCode, label: data.title });
    //                   h.item.push(val);
    //                   this.flag = false;
    //                 }
    //               });
    //             });
    //             console.log(this.toolSrv.ItemData);
    //             console.log(this.ItemData);
    //             this.localSrv.setObject('sidebarItem', this.ItemData);
    //           }
    //         );
    //       }
    //     });
    //   });
    // } else {
    //   // this.ItemData = []
    //   this.ItemData = this.localSrv.getObject('sidebarItem');
    // }
  }

  // change the text Color
  public sidebarColorClick(e): void {
    const li = document.getElementsByClassName('ui-panelmenu-header-link');
    for (let i  = 0 ; i < li.length; i++) {
      // @ts-ignore
      li[i].style.color = '#8F9198';
    }
    if (e.target.className === 'ui-menuitem-text') {
      e.path[1].style.color = '#3A79DD';
    } else {
      e.path[0].style.color = '#3A79DD';
    }
  }

  // Mouse movement change the text Color
  public sidebarColorMove(e): void {
    if (e.target.className === 'ui-menuitem-text') {
      this.slidingTop = e.path[1].offsetTop;
      this.slidinghight = e.path[1].offsetHeight;
    } else {
      this.slidingTop = e.path[1].offsetTop;
      this.slidinghight = e.path[1].offsetHeight;
    }
   }

  // Mouse leave  change the text Color
  public  sidebarColorMoveout(): void {
       this.slidinghight = 0;
       this.slidingTop = 0;
   }

  // View route activation
  public  sidebarRouterStatus(url): void {
    let position = 0;
    this.items.map((prop) => {
          position = position + 1;
          if (prop.routerLink.toString().split('/', 4)[3].indexOf(url) === 0) {
            const li = document.getElementsByClassName('ui-panelmenu-header-link');
            // @ts-ignore
            li[position - 1].style.color = '#3A7ADF';
            for (let i = position; i < li.length; i++) {
              // @ts-ignore
              li[i].style.color = '#8F9198';
            }
            for (let i = 0; i < position - 1; i++) {
              // @ts-ignore
              li[i].style.color = '#8F9198';
            }
          }
        });
  }
  // Listening to the parent component
  ngOnChanges(changes: SimpleChanges): void {
    // this.ItemData = [];
    this.ItemData = this.toolSrv.ItemData;
    if (this.localSrv.getObject('sidebarItem') === 1 || this.localSrv.getObject('sidebarItem') === null ) {
      this.localSrv.getObject('item').forEach(v => {
        this.ItemData.forEach( h => {
          if (v.title === h.title) {
            this.items = [];
            this.homeSrv.getChildrenRouter({parentCode: v.permisCode}).subscribe(
              (value) => {
                value.data.forEach( data => {
                  h.routingItem.forEach( val => {
                    if (val.label === data.title) {
                      this.sidebarItem.push({parentCode: data.parentCode, label: data.title });
                      h.item.push(val);
                      this.flag = false;
                    }
                  });
                });
                this.localSrv.setObject('sidebarItem', this.ItemData);
              }
            );
          }
        });
      });
    } else {
      this.ItemData = this.localSrv.getObject('sidebarItem');
    }
    try {
      this.ItemData.forEach( v => {
        if (this.data === v.title) {
          this.items  = v.item;
        }
      });
    } catch (e) {
      this.toolSrv.setToast('error', '操作失败', '该用户没有权限');
    }
  }
  // View rendering
  ngAfterViewInit(): void {
    this.url = this.location.path().split('/', 4)[3];
    this.sidebarRouterStatus(this.url);
    // 定略获取路由
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.url = event.url.split('/', 4)[3];
          this.sidebarRouterStatus(this.url);
        }
      }
    );
  }


}
