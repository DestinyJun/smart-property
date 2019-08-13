import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponTotalService {

  constructor(
    private http: HttpClient
  ) { }
  public queryCouponPageData(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findCouponPage`, pamars);
  }
  public queryCouponUserInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/roomInfo/Tree`, pamars);
  }
  public queryCouponList(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findByOrganizationId`, pamars);
  }
  public queryCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/findByCouponCode`, pamars);
  }
  public addCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/add`, pamars);
  }
  public deleteCouponInfo(pamars): Observable<any> {
    return this.http.post(environment.chargeUrl + `/coupon/delete`, pamars);
  }
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }
  public  queryCouponType(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/coupon/findCouponType`, pamars);
  }
  public  queryCouponInfoStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }
}
