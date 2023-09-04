import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { InfoLocation } from '../models/infoLocation.model';

@Injectable()
export class HubService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "hub");
  }

  async getAllAsync(): Promise<any> {
    const res = await this.getAll().toPromise();
    const data = res.data as Hub[];
    return data;
  }

  public getCenterHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getCenterHub",arrCols);
  }

  public getPoHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getPoHub", arrCols);
  }

  public getPoHubByCenterId(centerId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("centerId", centerId);

    return super.getCustomApiPaging("getPoHubByCenterId", arrCols, params);
  }

  public getStationHub(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
    return super.getCustomApiPaging("getStationHub", arrCols);
  }

  public getStationHubByPoId(poId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("poId", poId);

    return super.getCustomApiPaging("getStationHubByPoId", arrCols, params);
  }

  public getHubByWardId(wardId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("wardId", wardId);

    return super.getCustomApiPaging("getHubByWardId", arrCols, params);
  }

  public getReceiveHubByToHub(hubId: any, arrCols: string[] = []): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("hubId", hubId);

    return super.getCustomApiPaging("getReceiveHubByToHub", arrCols, params);
  }

  getInfoLocation(provinceName: any, districtName: any, wardName: any, provinceId: any, districtId: any, wardId: any, countryId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("provinceName", provinceName);
    params = params.append("districtName", districtName);
    params = params.append("wardName", wardName);
    params = params.append("provinceId", provinceId);
    params = params.append("districtId", districtId);
    params = params.append("wardId", wardId);
    params = params.append("countryId", countryId);
    return super.getCustomApiPaging("GetInfoLocation", [], params);
  }

  async getInfoLocationAsync(provinceName: any, districtName: any, wardName: any, provinceId: any, districtId: any, wardId: any, countryId: any): Promise<InfoLocation> {
    const res = await this.getInfoLocation(provinceName, districtName, wardName, provinceId, districtId, wardId, countryId).toPromise();
    if (!res) {
      return;
    }
    const data = res.data as InfoLocation;
    return data;
  }
}
