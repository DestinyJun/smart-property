import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BfOwnerService {

  constructor(
    private http: HttpClient
  ) { }

  public  queryOwerDataList(pamars): Observable<any> {
      return this.http.post(environment.sysetUrl + `/owner/findOwnerAllByPage`, pamars);
  }
  // Conditional search unitinfo
  public  queryOwerInfoListByCondition(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/owner/findOwnerByCondition`, pamars);
  }
  // upload owerInfo file
  public  uploadOwerInfoFile(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/import', body);
    // return  this.http.post('/recieveMessage', body);
  }
  public  addOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addOwner', body);
  }
  public  addSingleOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/addSingleOwner', body);
  }
  public  updateOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/updateOwner', body);
  }
  // delete owerInfo
  public  deleteRoomInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/deleteRoom', body);
  }
  public  deleteOwerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/logout', body);
  }
  public  queryOwerInfoDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/findOwnerDetail', body);
  }
  public  addRoomCodeAndOwnerInfo(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/addOwner', body);
  }
  public  queryUploadDetail(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/excel/findLog', body);
  }
  public  queryByMobileNumber(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/findByPhone', body);
  }
  // 按房间哈哈查询
  public  queryByroomCode(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/roomInfo/findByRoomCode', body);
  }

  public  queryUpdateInfoByroomCode(body): Observable<any> {
    return  this.http.post(environment.sysetUrl + '/owner/findToUpdate', body);
  }
}
