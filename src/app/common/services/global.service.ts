import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(
    private http: HttpClient
  ) { }
  // query villageInfo
  public  queryVillageInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByOrganizationId`, pamars);
  }
  // query regioninfo
  public queryRegionInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByVillageCode`, pamars);
  }
  // query Builinginfo
  public  queryBuilingInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByRegionCode`, pamars);
  }
  //  query unitinfo
  public  queryunitInfo(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByBuildingCode`, pamars);
  }
  // query roomCode
  public queryRoomCode(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/structure/findByUnitCode `, pamars);
  }

  // query system status values
  public queryAdminStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findAdminChoose`, pamars);
  }

  // query user configuration status values
  public queryNativeStatus(pamars): Observable<any> {
    return this.http.post(environment.sysetUrl + `/setting/findNativeChoose`, pamars);
  }
  // query village data tree
  public  queryTVillageTree(): Observable<any> {
      return this.http.post(environment.sysetUrl + `/villageChooze/findTree`, {});
  }
}
