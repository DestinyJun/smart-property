import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoginService} from '../common/services/login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../common/services/local-storage.service';
import {PublicMethedService} from '../common/public/public-methed.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventManager} from '@angular/platform-browser';

@Component({
  selector: 'rbi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit{

  @ViewChild('btn', {static: true}) btn: HTMLElement;
  public item: any[] = [];
  public loadHidden = true;
  public userLogin: FormGroup;
  constructor(
    public loginSrv: LoginService,
    private route: Router,
    private localSessionStorage: LocalStorageService,
    private toolSrv: PublicMethedService,
    private eventManager: EventManager
  ) {
  }

  ngOnInit() {
    this.userLogin = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    if (!(this.isOrTrue('username') && this.isOrTrue('password'))) {
      this.userLogin.setValue( {username: this.localSessionStorage.get('username'), password: this.localSessionStorage.get('password')});
    }
    // Monitor keyboard enter event
    this.eventManager.addGlobalEventListener('body', 'keydown.enter', () => {
      this.userLoginClick(this.userLogin);
    });
  }
  // user click event
  public  userLoginClick(user): void {
    this.loadHidden = false;
    this.localSessionStorage.set('username', user.value.username);
    this.localSessionStorage.set('password', user.value.password);
    this.login(user.value.username, user.value.password);
  }
  // Login request
  public  login(userName, passWord): void {

    this.loginSrv.login({username: userName, password: passWord , module: 'CLOUD_HOUSE_WEB'}).subscribe(
      (value) => {
        this.loadHidden = true;
        console.log(12);

        if (value.status === '1000') {
          this.item = [];
          this.localSessionStorage.set('appkey', value.data.token);
          value.data.permitDTOS.forEach( v => {
            // console.log(v);
            this.item.push({permisCode: v.permisCode , title: v.title});
          });
          this.localSessionStorage.setObject('item', this.item);
          this.localSessionStorage.setObject('sidebarItem', 1);

          this.route.navigate(['/home/main']);
          // console.log(this.localSessionStorage.get('appkey'));
        } else {
          this.toolSrv.setToast('error', '登录失败', value.message);
        }
      }
    );
  }
  // Determine if there is a username or password
  public  isOrTrue(index): any {
      if (this.localSessionStorage.get(index)) {
        return false;
      } else {
        return true;
      }
  }

}
