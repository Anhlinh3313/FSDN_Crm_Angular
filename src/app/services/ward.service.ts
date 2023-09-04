import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Ward } from '../models/ward.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { IdViewModel } from '../view-model/index';
import { environment } from '../../environments/environment';
import { PersistenceService } from 'angular-persistence';

@Injectable()
export class WardService  extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "ward");
  }

  public getWardByDistrictId(districtId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("districtId", districtId);

    return super.getCustomApi("getWardByDistrictId", params);
  }

  public getWardByDistrictIds(districtIds: number[], arrCols: string[] = []): Observable<ResponseModel> {
    let obj = new IdViewModel();
    obj.ids = districtIds;
    obj.cols = arrCols.join(",");

    return super.postCustomApi("getWardByDistrictIds", obj);
  }

  getWardByName(name: string, districtId: number = null) {
    let params = new HttpParams();
    params = params.append("name", name);

    if(districtId) {
      params = params.append("districtId", districtId.toString());
    }

    return super.getCustomApi("getWardByName", params);
  }
}
