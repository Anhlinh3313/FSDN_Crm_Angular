import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { District } from '../models/district.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { GeneralService } from './general.service';
import { IdViewModel } from '../view-model/index';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class DistrictService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "district");
  }

  public getDistrictByProvinceId(provinceId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("provinceId", provinceId);

    return super.getCustomApi("getDistrictByProvinceId", params);
  }

  public getDistrictByProvinceIds(provinceIds: number[], arrCols: string[] = []): Observable<ResponseModel> {
    let obj = new IdViewModel();
    obj.ids = provinceIds;
    obj.cols = arrCols.join(",");

    return super.postCustomApi("getDistrictByProvinceIds", obj);
  }

  getDistrictByName(name: string, provinceId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if(provinceId) {
      params = params.append("provinceId", provinceId.toString());
    }

    return super.getCustomApi("getDistrictByName", params);
  }
}
