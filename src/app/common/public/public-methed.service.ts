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
