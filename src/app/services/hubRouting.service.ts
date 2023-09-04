import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Country } from '../models/country.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { PersistenceService } from 'angular-persistence';
import { environment } from '../../environments/environment';

@Injectable()
export class HubRoutingService extends BaseService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "hubRouting");
  }

  getHubRoutingByPoHubId(poHubId: any) : Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("poHubId", poHubId);

    return super.getCustomApi("getHubRoutingByPoHubId", params);
  }

  getDatasFromHub(stationHubId: any, hubRoutingId: any) : Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("stationHubId", stationHubId);
    params = params.append("hubRoutingId", hubRoutingId);

    return super.getCustomApi("getDatasFromHub", params);
  }

  create(obj: Object) : Observable<ResponseModel> {
    return super.postCustomApi("create", obj);
  }

  update(obj) : Observable<ResponseModel> {
    return super.postCustomApi("update", obj);
  }
}