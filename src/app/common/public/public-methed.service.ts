import { Injectable } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {GlobalService} from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMethedService {

  private cleanTimer: any;
  private dataList: any[] =[];
  private dataName = null;
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
  public ItemData = [
    { title: '基础信息', item: [], routingItem: [
        {label: '业主资料', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/owner']},
        {label: '租户资料', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/tenantinfo']},
        {label: '收费项目', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/toll']},
        {label: '收费项目配置', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/roomCharge']},
        // {label: '工作组', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/workgroup']},
        {label: '员工档案', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/staff']},
        {label: '优惠券', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/coupon']},
        {label: '车位信息', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/parkingspace']},
        {label: '车辆信息', icon: 'pi pi-fw ', routerLink: ['/home/baseinfo/vehicle']},
      ] },
    { title: '关联设置', item: [] , routingItem: [
        {label: '员工分组', icon: 'pi pi-fw', routerLink: ['/home/assoc/assocstaff']},
      ]},
    { title: '首页', item: [] , routingItem: []},
    { title: '收费管理', item: [], routingItem:  [
        {label: '物业缴费', icon: 'pi pi-fw ', routerLink: ['/home/charge/payment']},
        {label: '缴费记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/details']},
        {label: '报表导出', icon: 'pi pi-fw ', routerLink: ['/home/charge/export']},
        // {label: '保证金', icon: 'pi pi-fw ', routerLink: ['/home/charge/margin']},
        // {label: '退款记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/record']},
        // {label: '欠款记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/arrears']},
        {label: '预缴记录', icon: 'pi pi-fw ', routerLink: ['/home/charge/prepayment']},
        // {label: '历史报表', icon: 'pi pi-fw ', routerLink: ['/home/charge/historicalreport']},
        {label: '车位管理', icon: 'pi pi-fw ', routerLink: ['/home/charge/parkspace']},
        // {label: '优惠券', icon: 'pi pi-fw ', routerLink: ['/home/charge/coupon']},
      ] },
    { title: '事件监视', item: [], routingItem: [
        {label: '日志监视', icon: 'pi pi-fw', routerLink: ['/home/monitor/log']},
        {label: '异常管理', icon: 'pi pi-fw', routerLink: ['/home/monitor/deviant']},
        {label: '投诉管理', icon: 'pi pi-fw', routerLink: ['/home/monitor/complaint']},
        {label: '巡检记录', icon: 'pi pi-fw', routerLink: ['/home/monitor/check']},
      ]},
    { title: '系统设置', item: [],  routingItem: [
        // {label: '车辆种类', icon: 'pi pi-fw ', routerLink: ['/home/system/carkind']},
        // {label: '车辆品牌', icon: 'pi pi-fw ', routerLink: ['/home/system/carbrand']},
        // {label: '民族管理', icon: 'pi pi-fw ', routerLink: ['/home/system/nation']},
        {label: '系统配置', icon: 'pi pi-fw ', routerLink: ['/home/system/config']},
        {label: '角色信息', icon: 'pi pi-fw ', routerLink: ['/home/system/part']},
        {label: '用户角色配置', icon: 'pi pi-fw ', routerLink: ['/home/system/role']},
        {label: '角色权限配置', icon: 'pi pi-fw ', routerLink: ['/home/system/permission']},
      ]},
    { title: '优惠券', item: [],  routingItem : [
        // {label: '车辆种类', icon: 'pi pi-fw ', routerLink: ['/home/system/carkind']},
        // {label: '车辆品牌', icon: 'pi pi-fw ', routerLink: ['/home/system/carbrand']},
        // {label: '民族管理', icon: 'pi pi-fw ', routerLink: ['/home/system/nation']},
        {label: '优惠券信息', icon: 'pi pi-fw ', routerLink: ['/home/coupon/total']},
        {label: '优惠券初审', icon: 'pi pi-fw ', routerLink: ['/home/coupon/review']},
        {label: '优惠券复审', icon: 'pi pi-fw ', routerLink: ['/home/coupon/pandingreview']},
        {label: '已审核', icon: 'pi pi-fw ', routerLink: ['/home/coupon/audited']},
      ] },
    { title: '退款', item: [],  routingItem: [
        // {label: '车辆种类', icon: 'pi pi-fw ', routerLink: ['/home/system/carkind']},
        // {label: '车辆品牌', icon: 'pi pi-fw ', routerLink: ['/home/system/carbrand']},
        // {label: '民族管理', icon: 'pi pi-fw ', routerLink: ['/home/system/nation']},
        {label: '退款信息', icon: 'pi pi-fw ', routerLink: ['/home/refund/info']},
        {label: '未退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/no']},
        {label: '已退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/already']},
        {label: '申请退款', icon: 'pi pi-fw ', routerLink: ['/home/refund/applicationInfo']},
        {label: '退款初审', icon: 'pi pi-fw ', routerLink: ['/home/refund/review']},
        {label: '退款复审', icon: 'pi pi-fw ', routerLink: ['/home/refund/pendreview']},
        {label: '退款已审核', icon: 'pi pi-fw ', routerLink: ['/home/refund/audited']},
      ] }
  ];
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalSrv: GlobalService) { }
  // set Toast
  public setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  /**
   * get Admin Status
   * @param parameter  (Request parameter)
   * @param callback
   */
  public  getAdminStatus(parameter, callback: (...args: any[]) => any): void {
    this.globalSrv.queryAdminStatus({settingType: parameter}).subscribe(
      value => {
        if (value.status === '1000') {
          callback(value.data);
        } else {
           callback([]);
        }
      }
    );
  }

  /**
   * get Native Status
   * @param parameter (Request parameter)
   * @param callback
   */
  public  getNativeStatus(parameter, callback: (...args: any[]) => any): void {
    this.globalSrv.queryNativeStatus({settingType: parameter}).subscribe(
      value => {
        if (value.status === '1000') {
          callback(value.data);
        } else {
          callback(false);
        }
      }
    );
  }

  /**
   * Set the data format
   * @param list  (getNatiuveStatus(getAdminStatus) result list)
   * @param status (Status value)
   * @param callback
   */
  public  setDataFormat(list: any[], status: any, callback: (...args: any[]) => any): void {
    this.dataList = [];
    list.forEach( v => {
       this.dataList.push({label: v.settingName, value: v.settingCode});
       if (status !== undefined && status !== '') {
         if (status.toString() === v.settingCode) {
           this.dataName = v.settingName;
         }
       }
       if (list.indexOf(v) === list.length - 1) {
          callback(this.dataList, this.dataName);
        }
     });
  }

  public  setConfirmation(title, message, callback: (...args: any[]) => any): void {
    this.confirmationService.confirm({
      message: `确认要${message}吗？`,
      header: `${title}` + `提醒`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        callback();
      },
      reject: () => {
      }
    });
  }
}
