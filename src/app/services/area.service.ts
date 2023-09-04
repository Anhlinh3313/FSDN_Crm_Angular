import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Area } from '../models/area.model';
import { ResponseModel } from '../models/response.model';
import { DataFilterViewModel } from '../view-model/dataFilter.viewModel';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AreaService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "area");
  }

  public GetDistrictAllowSelect(dataFilter: DataFilterViewModel): Observable<ResponseModel> {
      return super.postCustomApi("GetDistrictAllowSelect",dataFilter);
  }

  public GetDistrictSelected(dataFilter: DataFilterViewModel): Observable<ResponseModel> {
    return super.postCustomApi("GetDistrictSelected",dataFilter);
}

  public GetProvinceAllowSelectByArea(areaGroupId:any,areaId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("areaGroupId", areaGroupId);
    params = params.append("areaId", areaId);
    return super.getCustomApi("GetProvinceAllowSelectByArea", params);
 }

 public GetProvinceSelectedByArea(areaGroupId:any,areaId: any): Observable<ResponseModel> {
  let params = new HttpParams();
  params = params.append("areaGroupId", areaGroupId);
  params = params.append("areaId", areaId);
  return super.getCustomApi("GetProvinceSelectedByArea", params);
}

public GetByAreaGroup(areaGroupId:any): Observable<ResponseModel> {
  let params = new HttpParams();
  params = params.append("areaGroupId", areaGroupId);
  return super.getCustomApi("GetAreaByAreaGroupId", params);
}
}