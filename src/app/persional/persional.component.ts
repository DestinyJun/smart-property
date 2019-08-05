import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {LoginoutService} from '../common/services/loginout.service';
import {LocalStorageService} from '../common/services/local-storage.service';
import {Router} from '@angular/router';
import {PersionalService} from '../common/services/persional.service';
import {Persional} from '../common/model/persional.model';
import {PublicMethedService} from '../common/public/public-methed.service';

@Component({
  selector: 'rbi-persional',
  templateUrl: './persional.component.html',
  styleUrls: ['./persional.component.less']
})
export class PersionalComponent implements OnInit {

  public passwordHidden: boolean;
  public cleanTimer: any; // 清除时钟
  public changeUserInfo: Persional = new Persional();
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
  public educationalOption: any[] = [];
  public educationalName: any;
  public btnName = '修改密码';
  public btnColor = { background : '#66A6BD'};
  public ChangePassword = {
    oldpsw: '',
    newpsw: '',
    surepsw: '',
  };

  constructor(
    private loginOutSrv: LoginoutService,
    private localSrv: LocalStorageService,
    private router: Router,
    private persionSrv: PersionalService,
    private toolSrv: PublicMethedService,


  ) { }

  ngOnInit() {

    this.persionalInit();
    this.passwordHidden = true;
  }
  // user information initialization
  public persionalInit(): void {
    this.persionSrv.getUserInfo().subscribe(
        value => {
          if (value.status === '1000') {
            this.changeUserInfo = value.data;
            this.toolSrv.getAdminStatus('EDUCATIONAL_BACKGROUND', (e) => {
              this.toolSrv.setDataFormat(e, this.changeUserInfo.educationalBackground, (dataList, dataName) => {
                this.educationalOption = dataList;
                this.educationalName = dataName;
              });
            });
          } else {
            this.toolSrv.setToast('error', '请求失败', value.message);
          }
        }
      );
  }
  // submit user info
  public  changeUserInfoSubmitClick(): void {
    this.persionSrv.updateUserInfo(this.changeUserInfo).subscribe(
      value => {
        if (value.status === '1000') {
          this.toolSrv.setToast('success', '修改成功', '修改成功');
        } else {
          this.toolSrv.setToast('error', '修改失败', value.message);

        }
      }
    );
  }
  // sign out
  public  loginOutClick(): void {
    this.toolSrv.setConfirmation('退出', '退出登录', () => {
      this.loginOutSrv.logout({}).subscribe(
        (value) => {
          if (value.status === '1000') {
            this.localSrv.remove('appkey');
            this.localSrv.remove('sidebarItem');
            this.localSrv.remove('item');
            this.router.navigate(['/login']);
          } else {
            window.alert(value.message);
          }
        }
      );
    });
  }
  // back to previous
  public  backClick(): void {
      window.history.back();
  }
  // Change password submission
  public  changePasswordSubmitClick(): void {
    if (this.passwordHidden === true) {
      this.btnColor = { background : '#D9534F'};
      this.btnName = '提交';
      this.passwordHidden = false;
    } else {
        if (this.ChangePassword.newpsw === this.ChangePassword.surepsw) {
          this.changeUserInfo.password = this.ChangePassword.oldpsw;
          this.changeUserInfo.newPassword = this.ChangePassword.newpsw;
          this.persionSrv.updatePasswordInfo(this.changeUserInfo).subscribe(
            value => {
              if (value.status === '1000') {
                this.toolSrv.setToast('success', '', '修改成功');
                this.ChangePassword = {
                  newpsw: '',
                  oldpsw: '',
                  surepsw: '',
                };
                this.btnColor = { background : '#66A6BD'};
                this.btnName = '修改密码';
                this.passwordHidden = true;
              } else {
                this.toolSrv.setToast('error', '修改失败', value.message);
              }
            }
          );
        } else {
          this.toolSrv.setToast('error', '修改失败', '两次密码输入不一致');
        }
    }
  }
}
