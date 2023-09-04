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

@Injectable()
export class HubRouteService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiGeneralUrl, "hubRoute");
  }

  public getDatasFromHub(hubId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("hubId", hubId);

    return super.getCustomApi("getDatasFromHub", params);
  }

  public saveChangeHubRoute(hubId: any, wardIds: number[]): Observable<ResponseModel> {
    let obj = new Object();
    obj["hubId"] = hubId;
    obj["wardIds"] = wardIds;

    return super.postCustomApi("saveChangeHubRoute", obj);
  }
}
