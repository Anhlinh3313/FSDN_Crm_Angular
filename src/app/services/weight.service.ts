import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Weight } from '../models/weight.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { environment } from '../../environments/environment';
import { PersistenceService } from 'angular-persistence';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class WeightService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected persistenceService: PersistenceService) {
    super(httpClient, persistenceService, environment.apiPostUrl, "weight");
  }

  public GetByWeightGroup(weightGroupId:any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("weightGroupId", weightGroupId);
    return super.getCustomApi("GetByWeightGroup", params);
  }
}
